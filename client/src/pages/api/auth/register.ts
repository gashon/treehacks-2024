import type { NextApiRequest, NextApiResponse } from "next";

import { AUTH_COOKIE } from "@/consts";
import { createToken, verifyToken } from "@/lib/jwt";
import { AuthToken, RegisterPostRequest } from "@/types";
import { db } from "@/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.json({
      message: "Method not allowed",
    });

    return;
  }

  const { token: registrationToken } = req.body as RegisterPostRequest;

  let token: AuthToken;
  try {
    token = verifyToken<AuthToken>(registrationToken);
  } catch (err) {
    res.status(401).json({ message: "Failed to parse" });
    return;
  }

  // TODO(@gashon) update query to insert on duplicate key
  let user = await db
    .selectFrom("user")
    .select("email")
    .where("email", "=", token.email)
    .executeTakeFirst();

  if (!user)
    await db
      .insertInto("user")
      .values({
        email: token.email,
      })
      .execute();

  // attach to cookie
  res.setHeader(
    "Set-Cookie",
    `${AUTH_COOKIE}=${registrationToken}; HttpOnly; Path=/; Max-Age=2147483648`,
  );

  res.json({
    message: "success",
  });

  return;
}
