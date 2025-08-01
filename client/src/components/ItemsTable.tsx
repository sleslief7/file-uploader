import type { ItemType } from '@/interfaces/ItemInterface';
import { Flex, Table } from '@chakra-ui/react';
import { FiFileText } from 'react-icons/fi';
import { FaFolder } from 'react-icons/fa6';
import { useAuth } from '@/hooks/useAuth';

type ItemsProps = {
  items: ItemType[];
};
const ItemsTable = ({ items }: ItemsProps) => {
  const { user } = useAuth();
  return (
    <Table.Root variant="outline">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Name</Table.ColumnHeader>
          <Table.ColumnHeader>Owner</Table.ColumnHeader>
          <Table.ColumnHeader>Last modified</Table.ColumnHeader>
          <Table.ColumnHeader>File size</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {items.map((item: ItemType) => (
          <Table.Row key={item.id}>
            <Table.Cell>
              <Flex gap={3}>
                {item.isFile ? <FiFileText /> : <FaFolder />} {item.name}
              </Flex>
            </Table.Cell>
            <Table.Cell>{user!.name}</Table.Cell>
            <Table.Cell>{item.updatedAt.toString()}</Table.Cell>
            <Table.Cell textAlign="start">
              {item.size ? item.size : '-'}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default ItemsTable;
