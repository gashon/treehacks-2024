import type { NextApiRequest, NextApiResponse } from 'next';

import { AUTH_COOKIE } from '@/consts';
import { createToken, verifyToken } from '@/lib/jwt';
import { AuthToken, RegisterPostRequest, RegistrationToken } from '@/types';
import { db } from '@/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.json({
      message: 'Method not allowed',
    });

    return;
  }

  const { token: registrationToken } = req.body as RegisterPostRequest;

  let token: RegistrationToken;
  try {
    token = verifyToken<RegistrationToken>(registrationToken);
  } catch (err) {
    res.status(401).json({ message: 'Failed to parse' });
    return;
  }

  // TODO(@gashon) update query to insert on duplicate key
  let user = await db
    .selectFrom('user')
    .select('id')
    .where('email', '=', token.email)
    .executeTakeFirst();

  if (!user)
    //@ts-ignore
    user = await db
      .insertInto('user')
      .values({
        email: token.email,
      })
      .returning('id')
      .execute();

  if (!user) {
    res.json({
      message: 'Failed to create user',
    });
  }

  const authToken = createToken<AuthToken>({
    email: token.email,
    created_at: new Date().getTime(),
    user_id: user!.id,
  });

  // attach to cookie
  res.setHeader(
    'Set-Cookie',
    `${AUTH_COOKIE}=${authToken}; HttpOnly; Path=/; Max-Age=2147483648`
  );

  res.json({
    message: 'success',
  });

  return;
}
