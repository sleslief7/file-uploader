import { Center } from '@chakra-ui/react';
import LoginForm from '../forms/LoginForm';
import AuthFormContainer from '../forms/AuthFormContainer';

const LoginPage = () => {
  return (
    <Center flex="1">
      <AuthFormContainer>
        <LoginForm />
      </AuthFormContainer>
    </Center>
  );
};

export default LoginPage;
