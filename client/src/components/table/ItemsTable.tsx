import type { ItemType } from '@/interfaces/ItemInterface';
import {
  Flex,
  Table,
  EmptyState,
  VStack,
  ButtonGroup,
  Button,
} from '@chakra-ui/react';
import { FiFileText } from 'react-icons/fi';
import { TbFolders } from 'react-icons/tb';
import { FaFolder } from 'react-icons/fa6';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/util/formatDate';
import { bytesToMegabytes } from '@/util/bytesToMegabytes';
import useGetItems from '@/hooks/useGetItems';
import ItemMenu from './ItemMenu';
import { useNavigate } from 'react-router-dom';
import useFolderIdParam from '@/hooks/useFolderIdParam';

const ItemsTable = () => {
  const { user } = useAuth();
  const folderId = useFolderIdParam();
  const { data: items } = useGetItems(folderId);
  const navigate = useNavigate();

  if (items.length === 0) return <EmptyStateComponent />;

  return (
    <Table.Root variant="outline" interactive>
      <Table.ColumnGroup>
        <Table.Column htmlWidth="40%" />
        <Table.Column htmlWidth="30%" />
        <Table.Column htmlWidth="12%" />
        <Table.Column />
        <Table.Column />
      </Table.ColumnGroup>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Name</Table.ColumnHeader>
          <Table.ColumnHeader>Owner</Table.ColumnHeader>
          <Table.ColumnHeader>Last modified</Table.ColumnHeader>
          <Table.ColumnHeader>File size</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="end"></Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {items.map((item: ItemType) => (
          <Table.Row key={item.id}>
            <Table.Cell
              onClick={() => {
                if (!item.isFile) navigate(`/${item.id}`);
              }}
            >
              <Flex gap={3}>
                {item.isFile ? <FiFileText /> : <FaFolder />} {item.name}
              </Flex>
            </Table.Cell>
            <Table.Cell>{user!.name}</Table.Cell>
            <Table.Cell>{formatDate(item.updatedAt.toString())}</Table.Cell>
            <Table.Cell textAlign="start">
              {item.size ? bytesToMegabytes(item.size) : '-'}
            </Table.Cell>
            <Table.Cell textAlign="end">
              <ItemMenu item={item} />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const EmptyStateComponent = () => {
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
            <Button variant="outline">Create folder</Button>
            <Button>Upload file</Button>
          </ButtonGroup>
        </EmptyState.Content>
      </EmptyState.Root>
    </Flex>
  );
};

export default ItemsTable;
