import useGetItems from '@/hooks/useGetItems';
import ItemsTable from '../ItemsTable';

const Homepage = () => {
  const { data } = useGetItems();
  return (
    <div>
      <ItemsTable items={data} />
    </div>
  );
};

export default Homepage;
