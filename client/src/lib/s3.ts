import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/aws-sdk";

type SongFileConfig = {
  type: "song";
  userEmail: string;
  fileName: string;
};

const getKey = (config: UserFileConfig, extension: string) => {
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

  const putCommand = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: `audio/${fileType}`,
  });

  // @FIX TS ERROR
  const putUrl = await getSignedUrl(s3Client, putCommand, {
    expiresIn: 3600,
  });

  return putUrl;
};
