import type { NextApiRequest, NextApiResponse } from "next";

import { AUTH_COOKIE } from "@/consts";
import { verifyToken } from "@/lib/jwt";
import { getPresignedUrl } from "@/lib/s3";
import { AuthToken, S3PresignedGetRequest } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.json({
      message: "Method not allowed",
    });
    return;
  }

  let token: AuthToken;
  try {
    token = verifyToken<AuthToken>(req.cookies[AUTH_COOKIE]);
  } catch (err) {
    res.status(401).json({ message: "Failed to parse" });
    return;
  }

  // @ts-ignore
  const { file_name, file_type, readonly } = req.query as S3PresignedGetRequest;

  const { url, key } = await getPresignedUrl(file_type, {
    type: "song",
    userEmail: token.email,
    fileName: file_name,
    readonly: !!readonly,
  });

  res.json({
    data: {
      url,
      key,
    },
  });
}
