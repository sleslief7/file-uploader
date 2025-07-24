import { File, Folder, User } from '../../generated/prisma';

export type UserWithoutPassword = Omit<User, 'password'>;

type BreadcrumbItem = {
  folderName: string | undefined;
  folderId: number | null | undefined;
  position: number;
};

export type Breadcrumb = BreadcrumbItem[];

type Item = {
  id: number;
  isFile: boolean;
  name: string;
  size?: number;
  ownerId: number;
  parentId: number | null;
  updatedAt: Date;
};

export type Items = Item[];
