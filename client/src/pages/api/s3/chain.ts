import type { NextApiRequest, NextApiResponse } from "next";

import { AUTH_COOKIE } from "@/consts";
import { verifyToken } from "@/lib/jwt";
import { getPresignedUrl } from "@/lib/s3";
import { AuthToken, ChainPostRequest } from "@/types";
import { db } from "@/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") {
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

  const { s3_key } = req.body as ChainPostRequest;

  await db.res.json({
    data: {
      url: putUrl,
    },
  });
}
