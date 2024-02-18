import type { NextApiRequest, NextApiResponse } from "next";

import { AUTH_COOKIE } from "@/consts";
import { verifyToken } from "@/lib/jwt";
import { AuthToken, ChainPostRequest } from "@/types";
// import * as chain from "@/utils/blockchain/scripts/new_contract_deployment.js";
import { deployContract } from "@/utils/blockchain/scripts/new_contract_deploy";
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

  const { s3_key, file_name } = req.body as ChainPostRequest;

  // const chainAddress = await deployContract(
  //   token.user_id,
  //   new Date().toISOString(),
  // );
  //
  const song = await db
    .insertInto("song")
    .values({
      s3Key: s3_key,
      userId: token.user_id,
      chainAddress: "tmp",
      fileName: file_name,
    })
    .returningAll()
    .execute();

  res.json({
    data: {
      song,
    },
  });
}
