import { useCallback, useState, useRef, FC, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { AiOutlineSound } from 'react-icons/ai';
import { Toaster, toast } from 'sonner';
//import WaveSurfer from "wavesurfer.js";

import { queryClient } from '@/lib/react-query';
import {
  useUploadFile,
  getPresignedUrl,
  useGetSongs,
  uploadToChain,
  submitDMCAClaim,
} from '@/features/song';

const UploadingModal: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    'Opening media file',
    'Verifying originality with Sonoverse ML',
    'Generating presigned URL',
    'Uploading file to storage',
    'Uploading file to IPFS',
    'Hashing file',
    'Deploying chain contract',
    'All complete',
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      return;
    }

    if (currentStepIndex < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStepIndex(currentStepIndex + 1);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, currentStepIndex, steps.length]);

  if (!isOpen) return null;

  return (
    <div className='bg-black bg-opacity-60 fixed flex inset-0 items-center justify-center z-50'>
      <div className='bg-white max-w-2xl md:p-12 mx-4 p-8 rounded-lg shadow-xl w-full'>
        <div className='flex justify-center'>
          {/* Inline style for the spinner animation */}
          <div className='animate-spin border-b-2 border-blue-500 h-8 rounded-full w-8'></div>
        </div>
        <h2 className='font-semibold md:text-2xl mt-4 text-center text-xl'>
          Uploading...
        </h2>
        <ul className='list-none mt-6 space-y-2'>
          {steps.slice(0, currentStepIndex).map((step, index) => (
            <li
              key={index}
              className='flex items-center md:text-lg text-base'>
              <svg
                className='h-6 mr-2 text-blue-500 w-6'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path d='M5 13l4 4L19 7'></path>
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
  const [isUploading, setIsUploading] = useState(false);
  const uploadFileMutation = useUploadFile();

  const onDrop = useCallback(
    // TODO add notifications/loading indicator
    async (acceptedFiles) => {
      setIsUploading(true); // TODO fix

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

          await uploadToChain({
            fileName: file.name,
            fileType: file.type,
            s3Key: presignedResponse.key,
          });

          queryClient.invalidateQueries({ queryKey: ['songs'] });

          console.log('uploaded');
        }
      });

      setIsUploading(false); // TODO fix
    },
    [getPresignedUrl, uploadFileMutation]
  );

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.aac'],
    },
  });

  const files = acceptedFiles.map((file: File) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));

  return (
    <section className='container mx-auto w-full'>
      <UploadingModal isOpen={isUploading} />
      <div
        {...getRootProps({
          className:
            'bg-zinc-900 hover:bg-zinc-800 w-full flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-md cursor-pointer ',
        })}>
        <input {...getInputProps()} />
        <p>Click to upload your music</p>
      </div>
      {files?.length > 0 && (
        <aside className='mt-4'>
          <h4 className='font-semibold text-lg'>Files</h4>
          <ul>{files}</ul>
        </aside>
      )}
    </section>
  );
};

// const AudioVisualizer: FC<{ url: string }> = ({ url }) => {
// const wavesurferRef = useRef(null);
// useEffect(() => {
//   if (wavesurferRef.current) {
//     wavesurferRef.current.load(url);
//   }
// }, [url]);
// return (
//   <WaveSurfer
//     ref={wavesurferRef}
//     options={{ waveColor: 'violet', progressColor: 'purple' }}
//   />
// );
// };

const SongsList: FC = () => {
  const { data, isLoading } = useGetSongs();
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  const [audio, setAudio] = useState<Audio | undefined>(undefined);
  const visualizerRef = useRef<HTMLCanvasElement>(null);

  if (isLoading) return <p>Loading</p>;
  if (!data?.data?.songs) return <p>No songs</p>;

  useEffect(() => {
    // stop playing
    if (audio) {
      audio.play();
    }
  }, [audio]);

  const playAudio = async (song) => {
    try {
      const url = new URL(
        `https://treehacks-2024.s3.us-west-1.amazonaws.com/${song.s3Key}`
      );
      setAudioUrl(url);
      setAudio(new Audio(url));
    } catch (error) {
      console.error('Error playing the song', error);
    }
  };

  return (
    <section className='flex flex-col gap-2'>
      <p className='text-xl'>Your Songs</p>
      <ul className='flex-col gap-10'>
        {data.data.songs.map((song) => {
          return (
            <li
              key={`song:${song.id}`}
              className='flex flex-row items-center justify-between'>
              <p className='text-lg'>{song.fileName}</p>
              {/* {audioUrl && <AudioVisualizer url={audioUrl} />} */}
              <div
                className='cursor-pointer'
                onClick={() => playAudio(song)}>
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
  <header className='mb-10'>
    <h1 className='text-3xl'>Sonoverse</h1>
  </header>
);

const SubmitClaimButton: FC = () => {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClick = () => {
    setIsDisabled(true);
    const dmcaSubmissionToast = toast('Submitting DMCA claim...');

    toast.loading('Submitting DMCA claim... ', {
      id: dmcaSubmissionToast,
    });

    setTimeout(() => {
      toast.success('Submitted DMCA claim', {
        id: dmcaSubmissionToast,
      });
    }, 1500);
  };

  return (
    <button
      id='submitClaimBtn'
      disabled={isDisabled}
      onClick={handleClick}
      className={`bg-yellow-400 border-1 border-black font-bold px-3 py-1 rounded-full text-black ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-500'
      }`}>
      Submit Claim
    </button>
  );
};

export default function Home() {
  return (
    <main className='flex h-full justify-center mt-10 w-full'>
      <Toaster />

      <div className='lg:w-3/4 w-11/12'>
        <Banner />
        <Dropzone />
        <div className='mt-10'>
          <SongsList />
        </div>
        {/* TODO: Add submit claim button to each song in the list */}
        <SubmitClaimButton />
      </div>
    </main>
  );
}
