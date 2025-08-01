export interface ItemType {
  id: number;
  isFile: boolean;
  name: string;
  ownerId: number;
  parentId: number | null;
  updatedAt: Date | string;
  size: number | null;
}
