import { useModal } from '@/hooks/useModal';
import {
  Flex,
  VStack,
  ButtonGroup,
  Button,
  EmptyState,
} from '@chakra-ui/react';
import { TbFolders } from 'react-icons/tb';

export const EmptyStateComponent = () => {
  const { isFileOpen, setIsFileOpen, isFolderOpen, setIsFolderOpen } =
    useModal();
  return (
    <Flex width="100%">
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <TbFolders />
          </EmptyState.Indicator>
          <VStack textAlign="center">
            <EmptyState.Title>Start adding files</EmptyState.Title>
            <EmptyState.Description>
              Add a new file or create a folder to get started
            </EmptyState.Description>
          </VStack>
          <ButtonGroup>
            <Button
              variant="outline"
              onClick={() => setIsFolderOpen(!isFolderOpen)}
            >
              Create folder
            </Button>
            <Button onClick={() => setIsFileOpen(!isFileOpen)}>
              Upload file
            </Button>
          </ButtonGroup>
        </EmptyState.Content>
      </EmptyState.Root>
    </Flex>
  );
};
