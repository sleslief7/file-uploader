import { useAuth } from '@/hooks/useAuth';
import useFolderIdParam from '@/hooks/useFolderIdParam';
import useFolderTree from '@/hooks/useFolderTree';
import type { FolderTreeFolder } from '@/interfaces/UserInterface';
import {
  Spinner,
  TreeView,
  createTreeCollection,
  ScrollArea,
} from '@chakra-ui/react';
import { LuFolder } from 'react-icons/lu';
import { Tooltip } from '@/components/ui/tooltip';

type TreeProps = {
  focusedValue: string | null;
  setFocusedValue: React.Dispatch<React.SetStateAction<string | null>>;
  isNodeDisabled: (nodeId: number | null) => boolean;
  folderIdsBeingMoved: number[];
};

const Tree = ({
  focusedValue,
  setFocusedValue,
  isNodeDisabled,
  folderIdsBeingMoved,
}: TreeProps) => {
  const { user } = useAuth();
  const folderId = useFolderIdParam();
  const { data: folderTree, isPending } = useFolderTree(user?.id);

  if (isPending || !folderTree) return <Spinner />;

  const collection = createTreeCollection<FolderTreeFolder>({
    nodeToValue: (node) => node.id.toString(),
    nodeToString: (node) => node.name,
    nodeToChildren: (node) => node.folders,
    isNodeDisabled: (node) => isNodeDisabled(node.id),
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
                render={({ node, nodeState }) => {
                  if (folderIdsBeingMoved.includes(node.id ?? 0)) {
                    return null;
                  }

                  const isCurrentFolder = node.id === (folderId ?? 0);
                  const isDisabled = isNodeDisabled(node.id);

                  const ItemContainerComponent = nodeState.isBranch
                    ? TreeView.BranchControl
                    : TreeView.Item;
                  const ItemTextComponent = nodeState.isBranch
                    ? TreeView.BranchText
                    : TreeView.ItemText;

                  const itemComponent = (
                    <ItemContainerComponent
                      opacity={isDisabled ? 0.5 : 1}
                      cursor='pointer'
                    >
                      <LuFolder />
                      <ItemTextComponent>{node.name}</ItemTextComponent>
                    </ItemContainerComponent>
                  );

                  return (
                    <Tooltip
                      content="Can't move here because the item is already in this folder"
                      positioning={{ placement: 'right' }}
                      openDelay={500}
                      contentProps={{
                        bg: 'bg.subtle',
                        color: 'fg',
                        borderColor: 'border.subtle',
                      }}
                      disabled={!isCurrentFolder}
                    >
                      {itemComponent}
                    </Tooltip>
                  );
                }}
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
