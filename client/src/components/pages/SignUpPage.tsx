import { Box, Flex, Heading } from '@chakra-ui/react';
import SignupForm from '../SignupForm';

const SignUpPage = () => {
  return (
    <Flex direction="column" p={4} flex="1" justifyContent="center">
      <Box
        maxW="md"
        minW="sm"
        mx="auto"
        p={8}
        borderWidth={1}
        borderRadius="lg"
        bg="gray.subtle"
        boxShadow="md"
      >
        <Heading mb={6} textAlign="center" size="lg">
          Create an account
        </Heading>
        <SignupForm />
      </Box>
    </Flex>
  );
};

export default SignUpPage;
