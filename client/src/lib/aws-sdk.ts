import aws from "aws-sdk";

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-west-1",
});

export const SES = new aws.SES({ region: "us-west-1" });
export const senderEmail = "gashon@ghussein.org";
