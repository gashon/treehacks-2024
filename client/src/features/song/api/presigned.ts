import { S3PresignedGetRequest, GetPresignedUrlResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

type Presigned = {
  fileName: S3PresignedGetRequest["file_name"];
  fileType: S3PresignedGetRequest["file_type"];
};

export const getPresignedUrl = async ({ fileName, fileType }: Presigned) => {
  const res = await fetch(
    `/api/s3/presigned?file_name=${fileName}&file_type=${fileType}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    },
  );
  const data = await res.json();
  return data as GetPresignedUrlResponse;
};

export const useGetPresignedUrl = ({ fileName, fileType }: Presigned) => {
  return useQuery({
    queryKey: ["presigned"],
    queryFn: () => getPresignedUrl({ fileName, fileType }),
  });
};
