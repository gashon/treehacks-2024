import type { ChainPostRequest, PutChainResponse } from "@/types";

export const uploadToChain = async ({
  s3Key,
  fileName,
  fileType,
}: {
  s3Key: ChainPostRequest["s3_key"];
  fileName: ChainPostRequest["file_name"];
  fileType: ChainPostRequest["file_type"];
}) => {
  const res = await fetch(`/api/s3/chain`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({
      s3_key: s3Key,
      file_name: fileName,
      file_type: fileType,
    } as ChainPostRequest),
  });
  const data = await res.json();
  return data as PutChainResponse;
};
