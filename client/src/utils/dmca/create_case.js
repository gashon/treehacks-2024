import { fetch } from 'node-fetch';

const DMCA_API = 'https://api.dmca.com/';

export const createCase = async (body) => {
  return 200;
  const res = await fetch(DMCA_API + 'createCase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const response = await res.json();
  return response;
};
