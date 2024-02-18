import { Song } from "@/db/types";

export type AuthToken = {
  email: string;
  created_at: number;
  user_id: string;
};

export type RegistrationToken = {
  email: string;
  created_at: number;
};

export type LoginPostRequest = {
  email: string;
};

export type RegisterPostRequest = {
  token: string;
};

export type ChainPostRequest = {
  s3_key: string;
  file_name: string;
  file_type: string;
};

export type DMCAClaimRequest = {
  song_id: string;
  file_name: string;
  audio_link: string;
};

export type MintPostRequest = {
  file_name: string;
};

export type EmailTemplate = {
  from: string;
  subject: string;
  content: string;
  args?: Record<string, string | undefined>;
};

export type S3PresignedGetRequest = {
  file_name: string;
  file_type: string;
  readonly?: boolean;
};

type Response<T> = {
  data: T;
};

export type GetPresignedUrlResponse = Response<{
  url: string;
  key: string;
}>;

export type PutChainResponse = Response<{
  song: Song;
}>;

export type SongsGetResponse = Response<{
  songs: Pick<
    Song,
    "s3Key" | "chainAddress" | "id" | "fileName" | "createdAt"
  >[];
}>;
