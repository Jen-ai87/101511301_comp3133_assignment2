export interface User {
  _id: string;
  username: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthPayload {
  message: string;
  user: User;
}
