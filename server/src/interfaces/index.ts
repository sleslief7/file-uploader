import { Prisma, User } from '../../generated/prisma';

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

export type FolderWithContent = Prisma.FolderGetPayload<{
  include: { folders: { include: { folders: true, files: true } }, files: true };
}>;