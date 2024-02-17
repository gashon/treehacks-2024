import { useCallback, FC } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadFile, getPresignedUrl, uploadToChain } from "@/features/song";

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

          await uploadToChain({ s3Key: presignedResponse.key });
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
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
};

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <Dropzone />
    </main>
  );
}
