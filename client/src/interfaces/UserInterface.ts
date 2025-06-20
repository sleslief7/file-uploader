export interface User {
  name: string;
  id: number;
  username: string | null;
  email: string | null;
  password: string | null;
  googleId: string | null;
  profileImgUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSignupRequest {
  id?: number;
  name: string;
  username: string;
  password: string;
}
