import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { s3Client } from "@/lib/aws-sdk";

type SongFileConfig = {
  type: "song";
  userEmail: string;
  fileName: string;
};

const getKey = (config: SongFileConfig, extension: string) => {
  switch (config.type) {
    case "song":
      return `u/${config.userEmail}/songs/${config.fileName}.${extension}`;
    default:
      throw new Error("Invalid folder provided");
  }
};

export const getPresignedUrl = async (
  fileType: string,
  config: SongFileConfig,
) => {
  const extension = fileType.split("/")[1];
  if (!extension) throw new Error("Invalid file type provided");

  const key = getKey(config, extension);
  console.log("params", key, process.env.S3_BUCKET_NAME, fileType);

  const s3Client = new S3();
  const putCommand = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  // @FIX TS ERROR
  const putUrl = await getSignedUrl(s3Client, putCommand, {
    expiresIn: 3600,
  });

  return putUrl;
};
