import useFolderIdParam from '@/hooks/useFolderIdParam';
import useBreadcrumb from '@/hooks/useBreadcrumb';
import { Breadcrumb as ChakraBreadcrumb } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';

const Breadcrumb = () => {
  const folderId = useFolderIdParam();
  const { data: breadcrumbs } = useBreadcrumb(folderId);
  const navigate = useNavigate();

  return (
    <ChakraBreadcrumb.Root size="lg">
      <ChakraBreadcrumb.List>
        {breadcrumbs.map((breadcrumb) => {
          const LinkComponent =
            breadcrumb.folderId === folderId
              ? ChakraBreadcrumb.CurrentLink
              : ChakraBreadcrumb.Link;
          return (
            <Fragment key={`${breadcrumb.folderName}-${breadcrumb.position}`}>
              <ChakraBreadcrumb.Item
                cursor="pointer"
              >
                <LinkComponent
                  onClick={() => navigate(`/${breadcrumb.folderId ?? 'home'}`)}
                >
                  {breadcrumb.folderName}
                </LinkComponent>
              </ChakraBreadcrumb.Item>
              {breadcrumbs.length !== breadcrumb.position && (
                <ChakraBreadcrumb.Separator />
              )}
            </Fragment>
          );
        })}
      </ChakraBreadcrumb.List>
    </ChakraBreadcrumb.Root>
  );
};

export default Breadcrumb;
