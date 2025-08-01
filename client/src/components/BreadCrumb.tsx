import type { BreadCrumb } from '@/interfaces/folderInterface';
import { Breadcrumb } from '@chakra-ui/react';
import { LuHouse } from 'react-icons/lu';

type BreadcrumbProps = {
  breadcrumbs: BreadCrumb[];
};
const BreadcrumbComp = ({ breadcrumbs }: BreadcrumbProps) => {
  return (
    <Breadcrumb.Root size="lg">
      <Breadcrumb.List>
        {breadcrumbs.map((breadcrumb) => (
          <>
            <Breadcrumb.Item
              key={`${breadcrumb.folderName}-${breadcrumb.position}`}
            >
              <Breadcrumb.Link href="#">
                {breadcrumb.folderName === 'Home' ? <LuHouse /> : ''}{' '}
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
