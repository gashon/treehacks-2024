import type { DMCAClaimRequest } from '@/types';

export const submitDMCAClaim = async ({
  song_id,
  file_name,
  audio_link,
}: {
  song_id: DMCAClaimRequest['song_id'];
  file_name: DMCAClaimRequest['file_name'];
  audio_link: DMCAClaimRequest['audio_link'];
}) => {
  return 200;
};
