import type { NextApiRequest, NextApiResponse } from 'next';

import { AUTH_COOKIE } from '@/consts';
import { verifyToken } from '@/lib/jwt';
import { AuthToken, MintPostRequest } from '@/types';
import { mintNFT } from '@/utils/blockchain/nft/mint';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    res.json({
      message: 'Method not allowed',
    });
    return;
  }

  let token: AuthToken;
  try {
    token = verifyToken<AuthToken>(req.cookies[AUTH_COOKIE]);
  } catch (err) {
    res.status(401).json({ message: 'Failed to parse' });
    return;
  }

  const { file_name } = req.body as MintPostRequest;

  await mintNFT(token.email, file_name);

  res.status(200).json({ message: 'Minted' });
}
