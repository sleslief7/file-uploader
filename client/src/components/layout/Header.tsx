import { ColorModeButton } from '@/components/ui/color-mode';
import { useAuth } from '@/hooks/useAuth';
import useLogout from '@/hooks/useLogout';
import { LuSearch, LuX } from 'react-icons/lu';
import { Link as RouterLink } from 'react-router-dom';

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
  Input,
  Popover,
  Portal,
  VStack,
  Button,
} from '@chakra-ui/react';
import { useSearch } from '@/hooks/useSearch';
import { useState } from 'react';

const Header = () => {
  const { searchName, setSearchName } = useSearch();
  const [input, setInput] = useState(searchName || '');
  const { isAuth, user } = useAuth();
  const { mutate: logout } = useLogout();

  const handleSubmit = () => {
    setSearchName(input);
  };

  return (
    <Box as='header' bg='primary.subtle' px={4} py={2}>
      <Grid templateColumns='repeat(10, 1fr)' alignItems={'center'}>
        <GridItem colSpan={3}>
          <RouterLink to='/' style={{ textDecoration: 'none' }}>
            <HStack>
              <Image
                src='/favicon.png'
                alt='File Uploader'
                aspectRatio={1 / 1}
                w='40px'
              />
              <Text fontSize='2xl' textAlign='center'>
                File Uploader
              </Text>
            </HStack>
          </RouterLink>
        </GridItem>
        <GridItem w='100%' colSpan={4} justifySelf={'center'}>
          {isAuth && (
            <InputGroup
              startElement={
                <LuSearch cursor={'pointer'} onClick={handleSubmit} />
              }
              endElement={
                input && <LuX cursor={'pointer'} onClick={() => setInput('')} />
              }
            >
              <Input
                id='search-input'
                placeholder='Search...'
                borderRadius={50}
                variant='subtle'
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
              />
            </InputGroup>
          )}
        </GridItem>
        <GridItem colSpan={3} justifySelf={'end'}>
          <Center gap={2}>
            <ColorModeButton />
            {isAuth && (
              <Popover.Root positioning={{ placement: 'bottom-end' }}>
                <Popover.Trigger>
                  <Avatar.Root cursor='pointer'>
                    <Avatar.Fallback name={user!.name} />
                    <Avatar.Image src={user!.profileImgUrl} />
                  </Avatar.Root>
                </Popover.Trigger>
                <Portal>
                  <Popover.Positioner>
                    <Popover.Content>
                      <Popover.Arrow />
                      <Popover.Body>
                        <VStack align='stretch'>
                          <Button variant='ghost' justifyContent='flex-start'>
                            <Text>TBD</Text>
                          </Button>
                          <Button
                            variant='ghost'
                            justifyContent='flex-start'
                            onClick={() => logout()}
                          >
                            <Text>Logout</Text>
                          </Button>
                        </VStack>
                      </Popover.Body>
                    </Popover.Content>
                  </Popover.Positioner>
                </Portal>
              </Popover.Root>
            )}
          </Center>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Header;
