import useGetItems from '@/hooks/useGetItems';
import ItemsTable from '../ItemsTable';
import BreadcrumbComp from '../BreadCrumb';
import useGetBreadcrumb from '@/hooks/useGetBReadCrumb';

const Homepage = () => {
  const { data: items } = useGetItems();
  const { data: breadcrumbs } = useGetBreadcrumb();
  return (
    <div>
      <BreadcrumbComp breadcrumbs={breadcrumbs} />
      <ItemsTable items={items} />
    </div>
  );
};

export default Homepage;
