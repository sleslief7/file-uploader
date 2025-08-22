import { Box, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const tabs = ['Favorites', 'Shared with me'];
  return (
    <VStack
      alignItems={'start'}
      as='nav'
      position='fixed'
      left='0'
      h='100%'
      w='260px'
      p={4}
      shadow='lg'
    >
      {tabs.map((tab) => (
        <Box
          key={tab}
          bg={{ _hover: 'colorPalette.800' }}
          w={'100%'}
          borderRadius={'lg'}
          px={'2'}
        >
          <Link to={`/${tab}`}>{tab}</Link>
        </Box>
      ))}
    </VStack>
  );
};

export default Navbar;
