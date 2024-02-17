import { RegistrationToken, LoginPostRequest } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { createToken } from "@/lib/jwt";
import { sendLoginEmail } from "@/util/send-email";

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

  const { email } = req.body as LoginPostRequest;
  const token = createToken<RegistrationToken>({
    email,
    created_at: new Date().getTime(),
  });

  const loginLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register?token=${token}`;

  await sendLoginEmail({ email, loginLink });

  res.json({
    message: "success",
  });

  return;
}
