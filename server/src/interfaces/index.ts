import { User } from '../../generated/prisma';

export type UserWithoutPassword = Omit<User, 'password'>;

interface BreadcrumbItem {
  folderName: string | undefined;
  folderId: number | undefined;
  position: number;
}

export type Breadcrumb = BreadcrumbItem[];
