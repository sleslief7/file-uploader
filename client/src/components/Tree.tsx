import { useAuth } from '@/hooks/useAuth';
import useFolderTrees from '@/hooks/useFolderTrees';
import type { FolderTree } from '@/interfaces/UserInterface';
import { TreeView, createTreeCollection } from '@chakra-ui/react';
import { LuFolder } from 'react-icons/lu';

const Tree = () => {
  const { user } = useAuth();
  const { data: trees } = useFolderTrees(user?.id);

  const collection = createTreeCollection<FolderTree>({
    nodeToValue: (node) => node.id.toString(),
    nodeToString: (node) => node.name,
    nodeToChildren: (node) => node.folders,
    rootNode: {
      id: -1,
      name: 'home',
      folders: trees,
      files: [],
    },
  });

  if (true) return <></>;

  return (
    <TreeView.Root
      collection={collection}
      maxW='sm'
      size='sm'
      variant='solid'
      colorPalette='teal'
      defaultExpandedValue={['home']}
    >
      <TreeView.Label>Choose destination folder</TreeView.Label>
      <TreeView.Tree>
        <TreeView.Node
          render={({ node, nodeState }) =>
            nodeState.isBranch ? (
              <TreeView.BranchControl>
                <LuFolder />
                <TreeView.BranchText>{node.name}</TreeView.BranchText>
              </TreeView.BranchControl>
            ) : (
              <TreeView.Item>
                <LuFolder />
                <TreeView.ItemText>{node.name}</TreeView.ItemText>
              </TreeView.Item>
            )
          }
        />
      </TreeView.Tree>
    </TreeView.Root>
  );
};

export default Tree;
