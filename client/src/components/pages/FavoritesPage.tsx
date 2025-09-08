import { Text, Stack } from '@chakra-ui/react';
import ItemsTable from '../table/ItemsTable';

const FavoritesPage = () => {
  return (
    <Stack gap={0}>
      <Text textStyle='md' p={2} my={1.5}>
        Favorites
      </Text>
      <ItemsTable />
    </Stack>
  );
};

export default FavoritesPage;
