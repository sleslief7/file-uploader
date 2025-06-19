import { Flex } from '@chakra-ui/react';
import LoginForm from '../forms/LoginForm';

const LoginPage = () => {
  return (
    <Flex direction="column" p={4} flex="1" justifyContent="center">
      <LoginForm />
    </Flex>
  );
};

export default LoginPage;
