import type { ItemType } from '@/interfaces/ItemInterface';
import { Flex, Table } from '@chakra-ui/react';
import { FiFileText } from 'react-icons/fi';
import { FaFolder } from 'react-icons/fa6';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/util/formatDate';
import { bytesToMegabytes } from '@/util/bytesToMegabytes';
import useItems from '@/hooks/useItems';
import ItemMenu from './ItemMenu';
import { useNavigate } from 'react-router-dom';
import useFolderIdParam from '@/hooks/useFolderIdParam';
import { EmptyStateComponent } from '../EmptyStateComponent';

const ItemsTable = () => {
  const { user } = useAuth();
  const folderId = useFolderIdParam();
  const { data: items, isLoading } = useItems(folderId);
  const navigate = useNavigate();

  if (items.length === 0 && !isLoading) return <EmptyStateComponent />;

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

export default ItemsTable;
