import type { MintPostRequest, PutChainResponse } from '@/types';

export const mintNewNFT = async ({
  fileName,
}: {
  fileName: MintPostRequest['file_name'];
}) => {
  const res = await fetch(`/api/s3/mint`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
    body: JSON.stringify({
      file_name: fileName,
    } as MintPostRequest),
  });
  const data = await res.json();
};
