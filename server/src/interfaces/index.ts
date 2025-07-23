import { User } from '../../generated/prisma';

export type UserWithoutPassword = Omit<User, 'password'>;

type BreadcrumbItem = {
  folderName: string | undefined;
  folderId: number | null | undefined;
  position: number;
};

export type Breadcrumb = BreadcrumbItem[];
