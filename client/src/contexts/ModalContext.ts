import { createContext } from 'react';

interface ModalContextType {
  isFileOpen: boolean;
  setIsFileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFolderOpen: boolean;
  setIsFolderOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const ModalContext = createContext<ModalContextType>({
  isFileOpen: false,
  setIsFileOpen: () => {},
  isFolderOpen: false,
  setIsFolderOpen: () => {},
});
