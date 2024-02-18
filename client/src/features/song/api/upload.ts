import { RegisterPostRequest } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";

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
    body: file,
  });
  const data = await res.json();
  return data;
};

export const useUploadFile = () => {
  return useMutation({
    mutationKey: ["upload"],
    mutationFn: upload,
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });
};
