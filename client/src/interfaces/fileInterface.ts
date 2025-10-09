export interface MoveFileDto {
  fileId: number;
  newFolderId: number | null;
}

export type CloneFileDto = MoveFileDto;
