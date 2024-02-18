import { useCallback, FC } from "react";
import { useDropzone } from "react-dropzone";
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
            s3Key: presignedResponse.key,
          });
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

  console.log("data", data);
  return <></>;
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
        <SongsList />
      </div>
    </main>
  );
}
