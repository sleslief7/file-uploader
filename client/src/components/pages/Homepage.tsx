import ItemsTable from '../table/ItemsTable';
import BreadcrumbComp from '../BreadcrumbComp';
import { Stack } from '@chakra-ui/react';

const Homepage = () => {
  return (
    <Stack gap={2}>
      <BreadcrumbComp />
      <ItemsTable />
    </Stack>
  );
};

export default Homepage;
