import ItemsTable from '../table/ItemsTable';
import Breadcrumb from '../breadcrumb/Breadcrumb';
import { Box, Flex, Stack } from '@chakra-ui/react';
import AddMenu from '../AddMenu';
import Tree from '../Tree';

const Homepage = () => {
  return (
    <Stack gap={0}>
      <Flex p={2} justifyContent='space-between' alignItems='center'>
        <Breadcrumb />
        <AddMenu />
      </Flex>
      <ItemsTable />
      <Box pt={4}>
        <Tree />
      </Box>
    </Stack>
  );
};

export default Homepage;
