import useFolderIdParam from '@/hooks/useFolderIdParam';
import useGetBreadcrumb from '@/hooks/useGetBreadCrumb';
import { Breadcrumb } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const BreadcrumbComp = () => {
  const folderId = useFolderIdParam();
  const { data: breadcrumbs } = useGetBreadcrumb(folderId);
  const navigate = useNavigate();

  return (
    <Breadcrumb.Root size="lg">
      <Breadcrumb.List>
        {breadcrumbs.map((breadcrumb) => {
          const LinkComponent =
            breadcrumb.folderId === folderId
              ? Breadcrumb.CurrentLink
              : Breadcrumb.Link;
          return (
            <>
              <Breadcrumb.Item
                key={`${breadcrumb.folderName}-${breadcrumb.position}`}
                cursor="pointer"
              >
                <LinkComponent
                  onClick={() => navigate(`/${breadcrumb.folderId ?? 'home'}`)}
                >
                  {breadcrumb.folderName}
                </LinkComponent>
              </Breadcrumb.Item>
              {breadcrumbs.length === breadcrumb.position ? (
                ''
              ) : (
                <Breadcrumb.Separator />
              )}
            </>
          );
        })}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
};

export default BreadcrumbComp;
