import { ColorModeButton } from '@/components/ui/color-mode';
import { useAuth } from '@/hooks/useAuth';
import useLogout from '@/hooks/useLogout';
import { Box, Button, Grid, GridItem, Text } from '@chakra-ui/react';

const Header = () => {
  const { isAuth } = useAuth();
  const { mutate: logout } = useLogout();
  return (
    <Box as="header" bg="teal.subtle" px={4} py={2}>
      <Grid templateColumns="repeat(3, 1fr)" alignItems={'center'}>
        <GridItem colSpan={1} justifySelf={'start'}>
          <Text fontSize="xl">Menu</Text>
        </GridItem>
        <GridItem colSpan={1} justifySelf={'center'}>
          <Text fontSize="2xl" textAlign="center">
            File Uploader
          </Text>
        </GridItem>
        <GridItem colSpan={1} justifySelf={'end'}>
          <ColorModeButton />
          {isAuth && <Button onClick={() => logout()}>Logout</Button>}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Header;
