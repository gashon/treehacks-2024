import dynamic from "next/dynamic";
import { useCallback, useState, useRef, FC, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineSound } from "react-icons/ai";
import { Toaster, toast } from "sonner";
import { useGetStrikes } from "@/features/song";
// import { WaveSurfer } from "wavesurfer-react";

import { queryClient } from "@/lib/react-query";

import { YOUTUBE_LINKS } from "@/consts";
import {
  useUploadFile,
  getPresignedUrl,
  useGetSongs,
  uploadToChain,
  submitDMCAClaim,
  mintNewNFT,
} from "@/features/song";

const PerlinSketchNoSSR = dynamic(() => import("@/components/perlin"), {
  ssr: false,
});

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    // Increased z-index for modal overlay to ensure it's above everything
    <div className="bg-black bg-opacity-50 fixed flex inset-0 items-center justify-center z-50">
      <div
        className="bg-white p-8 rounded-lg"
        style={{
          width: "80%",
          height: "auto",
          maxWidth: "1100px",
          zIndex: 60,
        }}
      >
        {/* Adjusted size */}
        <div className="flex justify-end w-full">
          <button className="text-black" onClick={onClose}>
            X
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const UploadingModal: React.FC<{ isOpen: boolean; errorMessage?: string }> = ({
  isOpen,
  errorMessage,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const steps = [
    "Opening media file",
    "Verifying originality with Sonoverse ML",
    "Generating presigned URL",
    "Uploading file to storage and IPFS",
    "Hashing file",
    "Deploying chain contract",
    "All complete",
  ];

  useEffect(() => {
    if (!isOpen && !isAnimating) {
      setCurrentStepIndex(0);
      return;
    }

    if (currentStepIndex < steps.length) {
      setIsAnimating(true);
      const duration = Math.floor(Math.random() * (2500 - 1500) + 1500);

      const timer = setTimeout(() => {
        setCurrentStepIndex(currentStepIndex + 1);
      }, duration);

      return () => clearTimeout(timer);
    } else {
      if (errorMessage) toast.error(errorMessage);

      setIsAnimating(false);
      setCurrentStepIndex(0);
    }
  }, [isOpen, currentStepIndex, steps.length, setIsAnimating, isAnimating]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div className="bg-black fixed flex inset-0 items-center justify-center text-black z-50">
      <div className="bg-white max-w-2xl md:p-12 mx-4 p-8 rounded-lg shadow-xl w-full">
        <div className="flex justify-center">
          {/* Inline style for the spinner animation */}
          <div className="animate-spin border-b-2 border-blue-500 h-8 rounded-full w-8"></div>
        </div>
        <h2 className="font-semibold md:text-2xl mt-4 text-center text-xl">
          Uploading...
        </h2>
        <ul className="list-none mt-6 space-y-2">
          {steps.slice(0, currentStepIndex).map((step, index) => (
            <li key={index} className="flex items-center md:text-lg text-base">
              <svg
                className="h-6 mr-2 text-blue-500 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              {step}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Dropzone: FC = () => {
  const [isUploading, setIsUploading] = useState<{
    open: boolean;
    error?: string;
  }>({ open: false, error: undefined });
  const uploadFileMutation = useUploadFile();

  const onDrop = useCallback(
    // TODO add notifications/loading indicator
    async (acceptedFiles) => {
      setIsUploading({ open: true });

      acceptedFiles.forEach(async (file: File) => {
        // Get presigned URL for each file
        const { data: presignedResponse } = await getPresignedUrl({
          fileName: file.name,
          fileType: file.type,
        });

        if (presignedResponse.url) {
          // Upload file to the presigned URL
          uploadFileMutation.mutate({
            signedUrl: presignedResponse.url,
            file: file,
          });

          const res = await uploadToChain({
            fileName: file.name,
            fileType: file.type,
            s3Key: presignedResponse.key,
          });

          if (!res.message)
            queryClient.invalidateQueries({ queryKey: ["songs"] });

          await mintNewNFT({
            fileName: file.name,
          });

          queryClient.invalidateQueries({ queryKey: ["songs"] });

          setIsUploading({ open: false, error: res?.message ?? undefined });
        }
      });
    },
    [getPresignedUrl, uploadFileMutation],
  );

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".aac"],
    },
  });

  return (
    <section
      className="container mx-auto w-full"
      style={
        {
          // opacity: 0.85,
        }
      }
    >
      <UploadingModal
        isOpen={isUploading.open}
        errorMessage={isUploading.error}
      />
      <div
        {...getRootProps({
          className:
            "bg-zinc-900 hover:bg-zinc-800 w-full flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-md cursor-pointer ",
        })}
      >
        <input {...getInputProps()} />
        <p>Click to upload your music</p>
      </div>
    </section>
  );
};

const AudioVisualizer: FC<{ url: string }> = ({ url }) => {
  const wavesurferRef = useRef(null);
  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.load(url);
    }
  }, [url]);
  return (
    <WaveSurfer
      url={url}
      options={{ waveColor: "violet", progressColor: "purple" }}
    />
  );
};

const CopyrightLink: FC<{ rank: number; url: string }> = ({ rank, url }) => {
  return (
    <div className="flex gap-4 items-center justify-between w-full">
      <div className="flex flex-row gap-1">
        <p className="text-black">{rank}.</p>
        <a
          className="break-all hover:underline text-blue-600"
          target="_blank"
          href={url}
        >
          {url}
        </a>
      </div>
      <SubmitClaimButton />
    </div>
  );
};

const SongsList: FC = () => {
  const { data, isLoading } = useGetSongs();
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  const [audio, setAudio] = useState<Audio | undefined>(undefined);
  const visualizerRef = useRef<HTMLCanvasElement>(null);
  const { data: strikes } = useGetStrikes();

  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (isLoading) return <p>Loading</p>;
  if (!data?.data?.songs) return <p>No songs</p>;

  // useEffect(() => isOpen{
  //   // stop playing
  //   if (audio) {
  //     audio.play();
  //   }
  // }, [audio]);

  const playAudio = async (song) => {
    try {
      const url = new URL(
        `https://treehacks-2024.s3.us-west-1.amazonaws.com/${song.s3Key}`,
      );
      setAudioUrl(url);

      const audio = new Audio(url);
      audio.play();

      setAudio(audio);
    } catch (error) {
      console.error("Error playing the song", error);
    }
  };

  const handleNotificationsOpen = () => {
    handleOpenModal();
  };

  return (
    <section className="flex flex-col gap-2">
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <>
          <h2 className="font-bold mb-4 text-black text-xl">
            Copyright Infringements
          </h2>
          <ul className="flex flex-col gap-2">
            {(strikes?.data ?? []).map((link, i) => (
              <li
                key={`link:${i}`}
                className="flex flex-row items-center justify-between mb-2"
              >
                <CopyrightLink url={link} rank={i + 1} />
              </li>
            ))}
          </ul>
        </>
      </Modal>
      <p className="text-xl">Your Songs</p>
      <ul className="flex flex-col gap-15">
        {data.data.songs.map((song, index) => {
          const isFirst = index === data.data.songs.length - 1;
          return (
            <li
              key={`song:${song.id}`}
              className="flex flex-row items-center justify-between"
            >
              <div className="flex flex-col">
                {isFirst ? (
                  <a
                    className="cursor-pointer hover:underline text-blue-600 text-lg"
                    onClick={() => handleNotificationsOpen()}
                  >
                    {song.fileName}
                  </a>
                ) : (
                  <p className="text-lg">{song.fileName}</p>
                )}
                <p className="opacity-50">
                  {new Date(song.createdAt).toISOString()}
                </p>
              </div>
              <div className="cursor-pointer" onClick={() => playAudio(song)}>
                <AiOutlineSound />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

const Banner: FC = () => (
  <header className="mb-10">
    <h1 className="text-3xl">Sonoverse</h1>
  </header>
);

const SubmitClaimButton: FC = () => {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClick = () => {
    setIsDisabled(true);
    const dmcaSubmissionToast = toast("Submitting DMCA claim...");

    toast.loading("Submitting DMCA claim... ", {
      id: dmcaSubmissionToast,
    });

    setTimeout(() => {
      toast.success("Submitted DMCA claim", {
        id: dmcaSubmissionToast,
      });
    }, 1500);
  };

  return (
    <button
      id="submitClaimBtn"
      disabled={isDisabled}
      onClick={handleClick}
      className={`bg-blue-900 rounded opacity-75 text-white border-bottom-1 border-black px-3 py-1 text-black ${
        isDisabled ? "opacity-25 cursor-not-allowed" : "hover:bg-zinc-800"
      }`}
    >
      Submit Claim
    </button>
  );
};

export default function Home() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          zIndex: -100,
          opacity: 0.25,
        }}
      >
        <PerlinSketchNoSSR />
      </div>
      <main className="800 flex justify-center min-h-screen mt-10 w-full">
        <Toaster />

        <div className="lg:w-3/4 w-11/12">
          <Banner />
          <Dropzone />
          <div className="mt-10">
            <SongsList />
          </div>
        </div>
      </main>
    </>
  );
}
