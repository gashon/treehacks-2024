import { useCallback, FC } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineSound } from "react-icons/ai";

import { queryClient } from "@/lib/react-query";
import {
  useUploadFile,
  getPresignedUrl,
  useGetSongs,
  uploadToChain,
} from "@/features/song";

const Dropzone: FC = () => {
  const uploadFileMutation = useUploadFile();

  const onDrop = useCallback(
    // TODO add notifications/loading indicator
    async (acceptedFiles) => {
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

          queryClient.invalidateQueries({ queryKey: ["songs"] });

          console.log("uploaded");
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

  const files = acceptedFiles.map((file: File) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));

  return (
    <section className="container mx-auto w-full ">
      <div
        {...getRootProps({
          className:
            "bg-zinc-900 hover:bg-zinc-800 w-full flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-md cursor-pointer ",
        })}
      >
        <input {...getInputProps()} />
        <p>Click to upload your music</p>
      </div>
      {files?.length > 0 && (
        <aside className="mt-4">
          <h4 className="text-lg font-semibold">Files</h4>
          <ul>{files}</ul>
        </aside>
      )}
    </section>
  );
};

const SongsList: FC = () => {
  const { data, isLoading } = useGetSongs();

  if (isLoading) return <p>Loading</p>;
  if (!data.data?.songs) return <p>No songs</p>;

  const playAudio = async (song) => {
    try {
      const url = new URL(
        `https://treehacks-2024.s3.us-west-1.amazonaws.com/${song.s3Key}`,
      );
      const audio = new Audio(url);
      audio.play();
    } catch (error) {
      console.error("Error playing the song", error);
    }
  };

  return (
    <section className="flex flex-col gap-2">
      <p className="text-xl">Your Songs</p>
      <ul className="flex-col gap-10">
        {data.data.songs.map((song) => {
          return (
            <li
              key={`song:${song.id}`}
              className="flex flex-row justify-between items-center"
            >
              <p className="text-lg">{song.fileName}</p>
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

export default function Home() {
  return (
    <main className="w-full h-full flex justify-center mt-10">
      <div className="w-11/12 lg:w-3/4">
        <Banner />
        <Dropzone />
        <div className="mt-10">
          <SongsList />
        </div>
      </div>
    </main>
  );
}
