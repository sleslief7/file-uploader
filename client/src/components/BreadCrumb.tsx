import useGetBreadcrumb from '@/hooks/useGetBreadCrumb';
import { Breadcrumb } from '@chakra-ui/react';

const BreadcrumbComp = () => {
  const { data: breadcrumbs } = useGetBreadcrumb();

  return (
    <Breadcrumb.Root size="lg">
      <Breadcrumb.List>
        {breadcrumbs.map((breadcrumb) => (
          <>
            <Breadcrumb.Item
              key={`${breadcrumb.folderName}-${breadcrumb.position}`}
            >
              <Breadcrumb.Link href="#">
                {breadcrumb.folderName}
              </Breadcrumb.Link>
            </Breadcrumb.Item>
            {breadcrumbs.length === breadcrumb.position ? (
              ''
            ) : (
              <Breadcrumb.Separator />
            )}
          </>
        ))}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
};

export default BreadcrumbComp;
