import useFolderIdParam from '@/hooks/useFolderIdParam';
import useBreadcrumb from '@/hooks/useBreadcrumb';
import { Breadcrumb as ChakraBreadcrumb } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';
import BreadcrumbMenuItem from './BreadcrumbMenuItem';

const Breadcrumb = () => {
  const folderId = useFolderIdParam();
  const { data: items } = useBreadcrumb(folderId);
  const navigate = useNavigate();
  const sizeLimit = 4;
  const visibleCount =
    items.length <= sizeLimit ? -sizeLimit : -(sizeLimit - 1);

  const hiddenItems = items.slice(0, visibleCount);
  const visibleItems = items.slice(visibleCount);

  return (
    <ChakraBreadcrumb.Root size='lg'>
      <ChakraBreadcrumb.List>
        {hiddenItems.length > 0 && (
          <>
            <BreadcrumbMenuItem items={hiddenItems}>
              <ChakraBreadcrumb.Link>
                <ChakraBreadcrumb.Ellipsis />
              </ChakraBreadcrumb.Link>
            </BreadcrumbMenuItem>
            <ChakraBreadcrumb.Separator />
          </>
        )}
        {visibleItems.map((item) => {
          const LinkComponent =
            item.folderId === folderId
              ? ChakraBreadcrumb.CurrentLink
              : ChakraBreadcrumb.Link;

          return (
            <Fragment key={`${item.folderName}-${item.position}`}>
              <ChakraBreadcrumb.Item cursor='pointer'>
                <LinkComponent
                  onClick={() => navigate(`/${item.folderId ?? 'home'}`)}
                >
                  {item.folderName}
                </LinkComponent>
              </ChakraBreadcrumb.Item>
              {items.length !== item.position && <ChakraBreadcrumb.Separator />}
            </Fragment>
          );
        })}
      </ChakraBreadcrumb.List>
    </ChakraBreadcrumb.Root>
  );
};

export default Breadcrumb;
