export type AuthToken = {
  email: string;
  created_at: number;
};

export type LoginPostRequest = {
  email: string;
};

export type RegisterPostRequest = {
  token: string;
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
};

type Response<T> = {
  data: T;
};

export type GetPresignedUrlResponse = Response<{
  url: string;
}>;
