import { File, Prisma, User } from '../../generated/prisma';
import { z } from 'zod';
import { validateNullableFolderId } from '../validation/validators';

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
  isFavorite: boolean;
};

export type Items = Item[];

export type FolderBase = Prisma.FolderGetPayload<{}>;

export type FolderTree = FolderBase & {
  folders: FolderTree[];
  files: File[];
};

export type MoveFileDto = {
  fileId: number;
  newFolderId: number | null;
};

export type MoveFolderDto = {
  folderId: number;
  newFolderId: number | null;
};

export type Storage = {
  total: number;
  usedStorage: number;
};

export type GetItemsResponse = {
  items: Items;
  totalCount: number;
  page?: number;
  pageSize?: number;
};

const preProcessFodlerId = (folderIdRaw: any) => {
  if (folderIdRaw === undefined) return undefined;
  return validateNullableFolderId(folderIdRaw);
};

const preProcessFavoritesOnly = (favoritesOnlyRaw: any) => {
  if (!favoritesOnlyRaw) return false;
  if (favoritesOnlyRaw?.toLowerCase() === 'true') return true;
  return false;
};

export const getItemsQueryParamsSchema = z.object({
  search: z.string().optional(),
  favoritesOnly: z.preprocess(
    preProcessFavoritesOnly,
    z.boolean().default(false)
  ),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  folderId: z.preprocess(preProcessFodlerId, z.number().nullable().optional()),
});

export type GetItemsQueryParams = z.infer<typeof getItemsQueryParamsSchema>;
