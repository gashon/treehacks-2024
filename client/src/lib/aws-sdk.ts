import aws from "aws-sdk";
import { S3 } from "@aws-sdk/client-s3";

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-west-1",
  signatureVersion: "v4",
});

export const SES = new aws.SES({ region: "us-west-1" });
export const senderEmail = "gashon@ghussein.org";
export const s3Client = new S3({
  signatureVersion: "v4",
});
