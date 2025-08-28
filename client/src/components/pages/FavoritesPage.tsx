import { Heading, Stack } from '@chakra-ui/react';
import ItemsTable from '../table/ItemsTable';

const FavoritesPage = () => {
  return (
    <Stack>
      <Heading size='3xl'>Favorites</Heading>
      <ItemsTable />
    </Stack>
  );
};

export default FavoritesPage;
