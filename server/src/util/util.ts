import { File } from '../../generated/prisma';

export const cloneName = (src: string) => {
  src = src.trim();
  const lastDotIndex = src.lastIndexOf('.');

  const base = lastDotIndex !== -1 ? src.slice(0, lastDotIndex) : src;
  const ext = lastDotIndex !== -1 ? src.slice(lastDotIndex) : '';

  // Look for "(n)" only at the end of base
  const match = base.match(/\((\d+)\)$/);

  if (match) {
    const number = parseInt(match[1], 10);
    const incremented = number + 1;
    return base.replace(/\(\d+\)$/, `(${incremented})`) + ext;
  } else {
    return `${base}(1)${ext}`;
  }
};

export const cloneFilePathName = (
  file: File,
  newFolderId: number | null,
  newFileName: string | null = null
) => {
  let result = file.path;

  if (newFileName !== null) result = result.replace(file.name, newFileName);

  const newFolderIdString = newFolderId ? newFolderId.toString() : 'home';

  // Match text between first / and second /
  result = result.replace(/\/([^/]*)\//, `/${newFolderIdString}/`);
  return result;
};
