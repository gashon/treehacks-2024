import type { NextApiRequest, NextApiResponse } from "next";
import { YOUTUBE_LINKS } from "@/consts";

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

  res.json({
    data: YOUTUBE_LINKS,
  });
}
