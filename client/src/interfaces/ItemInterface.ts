export interface ItemType {
  id: number;
  isFile: boolean;
  name: string;
  ownerId: number;
  parentId: number | null;
  updatedAt: Date | string;
  size: number | null;
  isFavorite: boolean;
}

export interface SelectionType {
  [key: string]: boolean;
}

export type SetSelectionType = (selection: SelectionType) => void;
