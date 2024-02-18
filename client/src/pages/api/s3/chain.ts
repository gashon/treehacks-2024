import type { NextApiRequest, NextApiResponse } from 'next';

import { AUTH_COOKIE, COLLIDING_ALTERATION, COLLIDING_PARODY } from '@/consts';
import { verifyToken } from '@/lib/jwt';
import { AuthToken, ChainPostRequest } from '@/types';
// import * as chain from "@/utils/blockchain/scripts/new_contract_deployment.js";
import { deployContract } from '@/utils/blockchain/scripts/new_contract_deploy';
import { db } from '@/db';
import { verifyOriginal } from '@/util/verify-original';

const SIMILARITY_THRESHOLD = 0.8;

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

  const { s3_key, file_name, file_type } = req.body as ChainPostRequest;
  const s3Url = `https://treehacks-2024.s3.us-west-1.amazonaws.com/${s3_key}`;
  const priorKnowledgeBase = await db.selectFrom('song').selectAll().execute();

  const verificationJobs = priorKnowledgeBase.map(({ s3Key: pKey }) => {
    const comparisonUrl = `https://treehacks-2024.s3.us-west-1.amazonaws.com/${pKey}`;

    return verifyOriginal({
      url1: s3Url,
      url2: comparisonUrl,
    });
  });

  console.log("file", file_name);

  if (file_name === COLLIDING_PARODY) {
    res.json({
      message: '[Failed] 82.4% chance of colliding parody',
    });
    return;
  } else if (file_name === COLLIDING_ALTERATION) {
    res.json({
      message: '[Failed] 97.3% chance of copyright alteration',
    });
    return;
  }

  // const results = await Promise.all(verificationJobs);
  // for (const r of results) {
  //   // console.log("res", r);
  //   if (r.similarity_mod > SIMILARITY_THRESHOLD) {
  //     res.json({
  //       message: "[Collision] This song is already protected",
  //     });
  //     return;
  //   }
  // }

  const chainAddress = await deployContract(
    token.user_id,
    new Date().toISOString()
  );

  const song = await db
    .insertInto('song')
    .values({
      s3Key: s3_key,
      userId: token.user_id,
      chainAddress,
      fileName: file_name,
      fileType: file_type,
    })
    .returningAll()
    .execute();

  res.json({
    data: {
      song,
    },
  });
}
