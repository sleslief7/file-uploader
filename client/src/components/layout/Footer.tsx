import { Box, Flex, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box as='footer' bg='primary.subtle' p={4}>
      <Flex justifyContent={'center'}>
        <Text>By Leslie</Text>
      </Flex>
    </Box>
  );
};

export default Footer;
