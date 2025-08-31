export type FolderBreadcrumbItem = {
  folderName: string;
  folderId: number | null;
  position: number;
};

export interface MoveFolderDto {
  folderId: number;
  newFolderId: number | null;
}
