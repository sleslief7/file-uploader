import { ColorModeButton } from '@/components/ui/color-mode';
import { useAuth } from '@/hooks/useAuth';
import useLogout from '@/hooks/useLogout';
import { LuSearch } from "react-icons/lu";
import {
  Box,
  Avatar,
  Grid,
  GridItem,
  Text,
  Image,
  HStack,
  Center,
  InputGroup,
  Input
} from '@chakra-ui/react';

const Header = () => {
  const { isAuth, user } = useAuth();
  const { mutate: logout } = useLogout();

  return (
    <Box as="header" bg="teal.subtle" px={4} py={2}>
      <Grid templateColumns="repeat(10, 1fr)" alignItems={'center'}>
        <GridItem colSpan={3}>
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
        <GridItem w='100%' colSpan={4} justifySelf={'center'}>
          <InputGroup startElement={<LuSearch />}>
            <Input id='search-input' placeholder="Search..." borderRadius={50} variant="subtle" />
          </InputGroup>
        </GridItem>
        <GridItem colSpan={3} justifySelf={'end'}>
          <Center gap={2}>
            <ColorModeButton />
            {isAuth && (
              <Avatar.Root onClick={() => logout()} cursor="pointer">
                <Avatar.Fallback name={user!.name} />
                <Avatar.Image src={user!.profileImgUrl} />
              </Avatar.Root>
            )}
          </Center>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Header;
