import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Song {
  chainId: string;
  createdAt: Generated<Timestamp>;
  id: Generated<string>;
  updatedAt: Generated<Timestamp>;
  userId: string;
}

export interface User {
  createdAt: Generated<Timestamp>;
  email: string;
  id: Generated<string>;
  updatedAt: Generated<Timestamp>;
}

export interface DB {
  song: Song;
  user: User;
}
