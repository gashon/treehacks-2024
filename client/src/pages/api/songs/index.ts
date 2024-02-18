import type { NextApiRequest, NextApiResponse } from "next";

import { AUTH_COOKIE } from "@/consts";
import { createToken, verifyToken } from "@/lib/jwt";
import { AuthToken } from "@/types";
import { db } from "@/db";

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

  // TODO(@gashon) update query to insert on duplicate key
  const songs = await db
    .selectFrom("song")
    .select(["s3Key", "id", "chainAddress", "fileName", "fileType"])
    .where("userId", "=", token.user_id)
    .execute();

  res.json({
    data: { songs },
  });

  return;
}
