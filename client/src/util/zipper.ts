import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  type FolderTreeFolder,
  type FolderTreeFile,
  type FolderTreeItem,
} from '@/interfaces/UserInterface';

export const isFoldreTreeFile = (item: FolderTreeItem): boolean => {
  return (
    (item as FolderTreeFolder).folders === undefined &&
    (item as FolderTreeFolder).files === undefined
  );
};

async function addToZip(zip: JSZip, items: FolderTreeItem[]) {
  for (const item of items) {
    if (isFoldreTreeFile(item)) {
      const file = item as FolderTreeFile;
      const response = await fetch(file.url);
      if (!response.ok) throw new Error(`Failed to fetch ${file.url}`);
      const blob = await response.blob();
      zip.file(item.name, blob);
    } else {
      const folder = item as FolderTreeFolder;
      const folderZip = zip.folder(folder.name);
      if (folderZip)
        await addToZip(folderZip, [...folder.files, ...folder.folders]);
    }
  }
}

export async function downloadStructuredZip(items: FolderTreeItem[]) {
  const zip = new JSZip();
  await addToZip(zip, items);

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, 'archive.zip');
}
