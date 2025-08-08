import { type ReactNode } from 'react';
import { ModalContext } from '@/contexts/modalContext';
import { useState } from 'react';

const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isFileOpen, setIsFileOpen] = useState(false);
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  return (
    <ModalContext.Provider
      value={{ isFileOpen, setIsFileOpen, isFolderOpen, setIsFolderOpen }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
