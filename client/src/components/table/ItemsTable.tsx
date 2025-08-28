import type { ItemType } from '@/interfaces/ItemInterface';
import { Avatar, Flex, Table } from '@chakra-ui/react';
import { FiFileText } from 'react-icons/fi';
import { FaFolder } from 'react-icons/fa6';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/util/formatDate';
import { bytesToMegabytes } from '@/util/bytesToMegabytes';
import useItems from '@/hooks/useItems';
import ItemMenu from './ItemMenu';
import { useLocation, useNavigate } from 'react-router-dom';
import useFolderIdParam from '@/hooks/useFolderIdParam';
import { EmptyStateComponent } from '../EmptyStateComponent';
import { useState } from 'react';
import { useSearch } from '@/hooks/useSearch';

const ItemsTable = () => {
  const [selection, setSelection] = useState<{ [key: string]: boolean }>({});
  const { user } = useAuth();
  const { searchName } = useSearch();
  const folderId = useFolderIdParam();
  const { data: items, isLoading } = useItems(folderId, searchName);
  const navigate = useNavigate();
  const location = useLocation();
  let filteredItems = items;
  if (location.pathname === '/favorites') {
    filteredItems = items.filter((item) => item.isFavorite);
  }
  const handleRowSelection = (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    item: ItemType
  ) => {
    const newSelection: any = {};
    const itemIdentifier = toItemIdentifier(item);
    newSelection[itemIdentifier] = !selection[itemIdentifier];

    if (e.ctrlKey || e.metaKey) {
      setSelection({ ...selection, ...newSelection });
    } else {
      setSelection(newSelection);
    }
  };

  const toItemIdentifier = (item: ItemType): string =>
    `${item.isFile ? 'file' : 'folder'}-${item.id}`;

  if (items.length === 0 && !isLoading) return <EmptyStateComponent />;
  if (filteredItems.length === 0 && !isLoading)
    return <div>You do not have favorite files.</div>;

  return (
    <Table.Root variant='outline' interactive>
      <Table.ColumnGroup>
        <Table.Column htmlWidth='40%' />
        <Table.Column htmlWidth='30%' />
        <Table.Column htmlWidth='12%' />
        <Table.Column />
        <Table.Column />
      </Table.ColumnGroup>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Name</Table.ColumnHeader>
          <Table.ColumnHeader>Owner</Table.ColumnHeader>
          <Table.ColumnHeader>Last modified</Table.ColumnHeader>
          <Table.ColumnHeader>File size</Table.ColumnHeader>
          <Table.ColumnHeader textAlign='end'></Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {filteredItems.map((item: ItemType) => (
          <Table.Row
            key={`item-${item.id}-${item.isFile ? 'file' : 'folder'}`}
            cursor={!item.isFile ? 'pointer' : 'default'}
            onClick={(e) => handleRowSelection(e, item)}
            onDoubleClick={() => {
              if (!item.isFile) navigate(`/${item.id}`);
            }}
            backgroundColor={
              selection[toItemIdentifier(item)] === true
                ? 'primary.subtle'
                : undefined
            }
          >
            <Table.Cell>
              <Flex gap={3}>
                {item.isFile ? <FiFileText /> : <FaFolder />} {item.name}
              </Flex>
            </Table.Cell>
            <Table.Cell>
              <Avatar.Root>
                <Avatar.Fallback name={user!.name} />
                <Avatar.Image src={user!.profileImgUrl} />
              </Avatar.Root>
            </Table.Cell>
            <Table.Cell>{formatDate(item.updatedAt.toString())}</Table.Cell>
            <Table.Cell textAlign='start'>
              {item.size ? bytesToMegabytes(item.size) : '-'}
            </Table.Cell>
            <Table.Cell textAlign='end'>
              <ItemMenu item={item} />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default ItemsTable;
