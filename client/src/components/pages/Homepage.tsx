import ItemsTable from '../table/ItemsTable';
import BreadcrumbComp from '../BreadcrumbComp';
import { Box, Stack } from '@chakra-ui/react';

const Homepage = () => {
  return (
    <Stack gap={2}>
      <Box p={2}>
        <BreadcrumbComp />
      </Box>
      <ItemsTable />
    </Stack>
  );
};

export default Homepage;
