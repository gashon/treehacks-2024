import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/aws-sdk";

type SongFileConfig = {
  type: "song";
  userEmail: string;
  fileName: string;
  readonly: boolean;
};

const getKey = (config: SongFileConfig, extension: string) => {
  switch (config.type) {
    case "song":
      return `u/${config.userEmail}/songs/${config.fileName}`;
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

  let command;
  if (!config.readonly)
    command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });
  else
    command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    });

  // @FIX TS ERROR
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });

  return { url, key };
};
