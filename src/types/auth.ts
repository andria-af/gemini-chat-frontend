export interface IUser {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILoginPayload {
  username: string;
}