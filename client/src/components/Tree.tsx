import { useAuth } from '@/hooks/useAuth';
import useFolderTree from '@/hooks/useFolderTree';
import type { FolderTree } from '@/interfaces/UserInterface';
import {
  Spinner,
  TreeView,
  createTreeCollection,
  ScrollArea,
} from '@chakra-ui/react';
import { LuFolder } from 'react-icons/lu';

type TreeProps = {
  focusedValue: string | null;
  setFocusedValue: React.Dispatch<React.SetStateAction<string | null>>;
  folderIdsBeingMoved: number[];
};

const Tree = ({
  focusedValue,
  setFocusedValue,
  folderIdsBeingMoved,
}: TreeProps) => {
  const { user } = useAuth();
  const { data: folderTree, isPending } = useFolderTree(user?.id);

  if (isPending || !folderTree) return <Spinner />;

  const collection = createTreeCollection<FolderTree>({
    nodeToValue: (node) => node.id.toString(),
    nodeToString: (node) => node.name,
    nodeToChildren: (node) => node.folders,
    isNodeDisabled: (node) => node.name.length > 0,
    rootNode: {
      id: -1,
      name: 'ROOT',
      folders: [folderTree],
      files: [],
    },
  });

  return (
    <ScrollArea.Root height='12rem' variant='hover'>
      <ScrollArea.Viewport>
        <ScrollArea.Content paddingEnd='3' textStyle='sm'>
          <TreeView.Root
            collection={collection}
            maxW='sm'
            size='sm'
            variant='solid'
            colorPalette='teal'
            defaultExpandedValue={['0']}
            focusedValue={focusedValue}
            onFocusChange={(s) => setFocusedValue(s.focusedValue)}
          >
            <TreeView.Label>Choose destination folder</TreeView.Label>
            <TreeView.Tree>
              <TreeView.Node
                render={({ node }) => (
                  <TreeView.BranchControl>
                    <LuFolder />
                    <TreeView.BranchText>{node.name}</TreeView.BranchText>
                  </TreeView.BranchControl>
                )}
              />
            </TreeView.Tree>
          </TreeView.Root>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar />
    </ScrollArea.Root>
  );
};

export default Tree;
