import { ColorModeButton } from '@/components/ui/color-mode';
import { useAuth } from '@/hooks/useAuth';
import useLogout from '@/hooks/useLogout';
import {
  Box,
  Button,
  Grid,
  GridItem,
  Text,
  Image,
  HStack,
} from '@chakra-ui/react';
import AddMenu from '../AddMenu';

const Header = () => {
  const { isAuth } = useAuth();
  const { mutate: logout } = useLogout();
  return (
    <Box as="header" bg="teal.subtle" px={4} py={2}>
      <Grid templateColumns="repeat(3, 1fr)" alignItems={'center'}>
        <GridItem>{isAuth && <AddMenu />}</GridItem>
        <GridItem colSpan={1} justifySelf={'center'}>
          <HStack>
            <Image
              src="/favicon.png"
              alt="File Uploader"
              aspectRatio={1 / 1}
              w="40px"
            />
            <Text fontSize="2xl" textAlign="center">
              File Uploader
            </Text>
          </HStack>
        </GridItem>
        <GridItem colSpan={1} justifySelf={'end'}>
          <ColorModeButton />
          {isAuth && (
            <Button rounded="sm" onClick={() => logout()}>
              Logout
            </Button>
          )}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Header;
