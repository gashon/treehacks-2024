import { RegisterPostRequest } from "@/types";
import { useMutation } from "@tanstack/react-query";

const upload = async ({
  signedUrl,
  file,
}: {
  signedUrl: string;
  file: File;
}) => {
  const res = await fetch(signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    // TODO(@gashon) send file
    // body: JSON.stringify(body),
  });
  const data = await res.json();
  return data;
};

export const useUploadFile = () => {
  return useMutation({
    mutationKey: ["upload"],
    mutationFn: upload,
  });
};
