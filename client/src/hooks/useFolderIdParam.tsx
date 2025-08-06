import { useParams } from 'react-router-dom';

const useFolderIdParam = (): number | null => {
  const { folderId: folderIdParam } = useParams();
  const isHomeOrNull = folderIdParam === 'home' || !folderIdParam;

  if (isHomeOrNull) return null;

  if (isNaN(Number(folderIdParam))) throw new Error('Invalid folder id');

  return Number(folderIdParam);
};

export default useFolderIdParam;
