import { useCallback, FC } from "react";
import { useDropzone } from "react-dropzone";

const Dropzone: FC = () => {
  const onDrop = useCallback(() => {
    // Do something with the files
  }, []);

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
