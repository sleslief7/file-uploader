import ItemsTable from '../table/ItemsTable';
import Breadcrumb from '../breadcrumb/Breadcrumb';
import { Flex, Stack } from '@chakra-ui/react';
import AddMenu from '../AddMenu';

const Homepage = () => {
  return (
    <Stack gap={0}>
      <Flex p={2} justifyContent='space-between' alignItems='center'>
        <Breadcrumb />
        <AddMenu />
      </Flex>
      <ItemsTable />
    </Stack>
  );
};

export default Homepage;
