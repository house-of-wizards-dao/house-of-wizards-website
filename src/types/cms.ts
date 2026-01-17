/**
 * CMS Types
 */

export type UserRole = "editor" | "admin";

export type User = {
  id: string;
  eth_address: string;
  twitter_handle: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type NewsStatus = "draft" | "published";

export type NewsItem = {
  id: number;
  text: string;
  date: string;
  author: string;
  author_id: string | null;
  highlight: boolean;
  title: string | null;
  status: NewsStatus;
  created_at: string;
  updated_at: string;
};

export type CreateNewsInput = {
  text: string;
  title?: string;
  author: string;
  highlight?: boolean;
  status?: NewsStatus;
  date?: string;
};

export type UpdateNewsInput = Partial<CreateNewsInput>;

export type CreateUserInput = {
  eth_address: string;
  twitter_handle?: string;
  role?: UserRole;
};

export type UpdateUserInput = {
  twitter_handle?: string;
  role?: UserRole;
};
