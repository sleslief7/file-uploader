import ItemsTable from '../table/ItemsTable';
import BreadcrumbComp from '../BreadCrumb';
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
