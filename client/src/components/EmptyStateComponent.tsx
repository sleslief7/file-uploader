import { useModal } from '@/hooks/useModal';
import {
  Flex,
  VStack,
  ButtonGroup,
  Button,
  EmptyState,
} from '@chakra-ui/react';
import { TbFolders } from 'react-icons/tb';
import { useLocation } from 'react-router-dom';

export const EmptyStateComponent = () => {
  const { isFileOpen, setIsFileOpen, isFolderOpen, setIsFolderOpen } =
    useModal();

  const location = useLocation();
  const isFavoritesScreen = location.pathname === '/favorites';

  if (isFavoritesScreen)
    return (
      <Flex width='100%'>
        <EmptyState.Root>
          <EmptyState.Content>
            <VStack textAlign='center'>
              <EmptyState.Title>You do not have favorites</EmptyState.Title>
              <EmptyState.Description>
                Mark files or folders as favorites to see them here
              </EmptyState.Description>
            </VStack>
          </EmptyState.Content>
        </EmptyState.Root>
      </Flex>
    );

  return (
    <Flex width='100%'>
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <TbFolders />
          </EmptyState.Indicator>
          <VStack textAlign='center'>
            <EmptyState.Title>Start adding files</EmptyState.Title>
            <EmptyState.Description>
              Add a new file or create a folder to get started
            </EmptyState.Description>
          </VStack>
          <ButtonGroup>
            <Button
              variant='outline'
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
