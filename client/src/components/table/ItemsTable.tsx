import type { ItemType } from '@/interfaces/ItemInterface';
import { Avatar, Flex, Icon, Table } from '@chakra-ui/react';
import { FiFileText } from 'react-icons/fi';
import { FaRegStar } from 'react-icons/fa';
import { FaFolder, FaStar } from 'react-icons/fa6';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/util/formatDate';
import { bytesToMegabytes } from '@/util/bytesToMegabytes';
import useItems from '@/hooks/useItems';
import ItemMenu from './ItemMenu';
import { useLocation, useNavigate } from 'react-router-dom';
import useFolderIdParam from '@/hooks/useFolderIdParam';
import { EmptyStateComponent } from '../EmptyStateComponent';
import { useState, useEffect, useRef } from 'react';
import { useSearch } from '@/hooks/useSearch';
import useFavorite from '@/hooks/useFavorite';

const ItemsTable = () => {
  const [selection, setSelection] = useState<{ [key: string]: boolean }>({});
  const tableRef = useRef<HTMLTableSectionElement>(null);
  const { user } = useAuth();
  const { searchName } = useSearch();
  const { mutate: makeFavoriteItem } = useFavorite();
  const folderId = useFolderIdParam();
  const location = useLocation();
  const isFavoritesScreen = location.pathname === '/favorites';

  const { data, isLoading } = useItems(
    isFavoritesScreen ? undefined : folderId,
    searchName,
    1,
    100,
    isFavoritesScreen
  );

  const { items } = data;

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target as Node)
      ) {
        setSelection({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleFavorite = (item: ItemType) => {
    makeFavoriteItem(item);
  };

  const toItemIdentifier = (item: ItemType): string =>
    `${item.isFile ? 'file' : 'folder'}-${item.id}`;

  if (items.length === 0 && !isLoading) return <EmptyStateComponent />;

  return (
    <Table.Root variant='outline' interactive>
      <Table.ColumnGroup>
        <Table.Column htmlWidth='55%' />
        <Table.Column htmlWidth='15%' />
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
      <Table.Body ref={tableRef}>
        {items.map((item: ItemType) => (
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
              <Icon
                cursor='pointer'
                color={`${item.isFavorite ? 'yellow.400' : 'bg.inverted'}`}
                transition='transform 0.15s cubic-bezier(.08,.52,.52,1)'
                _hover={{
                  transform: 'scale(1.2)',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavorite(item);
                }}
              >
                {item.isFavorite ? <FaStar /> : <FaRegStar />}
              </Icon>
              <ItemMenu item={item} />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default ItemsTable;
