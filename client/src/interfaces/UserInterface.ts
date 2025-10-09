export interface User {
  name: string;
  id: number;
  username: string | null;
  email: string | null;
  password: string | null;
  googleId: string | null;
  profileImgUrl: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSignupRequest {
  id?: number;
  name: string;
  username: string;
  password: string;
}

export type Storage = {
  total: number;
  usedStorage: number;
};

export type FolderTreeFolder = {
  id: number;
  name: string;
  folders: FolderTreeFolder[];
  files: FolderTreeFile[];
};

export type FolderTreeFile = {
  id: number;
  name: string;
  url: string;
};

export type FolderTreeItem = FolderTreeFolder | FolderTreeFile;
