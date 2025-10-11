import type { SelectionType } from '@/interfaces/ItemInterface';

export const getSelectedIds = (
  type: 'file' | 'folder',
  selection: SelectionType
): number[] =>
  Object.entries(selection)
    .filter(([key, value]) => value && key.startsWith(`${type}-`))
    .map(([key]) => Number(key.replace(`${type}-`, '')));
