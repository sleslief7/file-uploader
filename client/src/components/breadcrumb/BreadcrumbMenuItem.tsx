import type { FolderBreadcrumbItem } from '@/interfaces/folderInterface';
import { Breadcrumb as ChakraBreadcrumb, Menu, Portal } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

interface BreadcrumbMenuItemProps {
  children: React.ReactNode;
  items: FolderBreadcrumbItem[];
}

const BreadcrumbMenuItem = (props: BreadcrumbMenuItemProps) => {
  const { children, items } = props;
  const navigate = useNavigate();
  return (
    <ChakraBreadcrumb.Item cursor='pointer'>
      <Menu.Root>
        <Menu.Trigger asChild>{children}</Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              {items.map((item) => (
                <Menu.Item
                  key={`${item.folderId}-${item.folderName}`}
                  value={item.folderName}
                  onClick={() => navigate(`/${item.folderId ?? 'home'}`)}
                >
                  {item.folderName}
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </ChakraBreadcrumb.Item>
  );
};

export default BreadcrumbMenuItem;
