import { Box, Heading } from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';
import LoginForm from '../forms/LoginForm';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <Box
      maxW="md"
      minW="sm"
      mx="auto"
      mt={16}
      p={8}
      borderWidth={1}
      borderRadius="lg"
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow="md"
    >
      <Heading mb={6} textAlign="center" size="lg">
        Sign in to your account
      </Heading>
      <LoginForm />

      <Link to="/sign-up">Create an account</Link>
    </Box>
  );
};

export default LoginPage;
