import { S3PresignedGetRequest } from "@/types";
import { useQuery } from "@tanstack/react-query";

const getPresigned = async ({
  fileName,
  fileType,
}: {
  fileName: S3PresignedGetRequest["file_name"];
  fileType: S3PresignedGetRequest["file_type"];
}) => {
  const res = await fetch(
    `/api/api/s3/presigned?file_name=${fileName}&file_type=${fileType}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    },
  );
  const data = await res.json();
  return data;
};

export const useGetPresignedUrl = () => {
  return useQuery({
    queryFn: getPresigned,
  });
};
