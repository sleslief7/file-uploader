import { ModalContext } from '@/contexts/modalContext';
import { useContext } from 'react';

export const useModal = () => {
  return useContext(ModalContext);
};
