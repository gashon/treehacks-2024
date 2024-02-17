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
