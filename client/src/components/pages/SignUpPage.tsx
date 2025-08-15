import { Center } from '@chakra-ui/react';
import SignupForm from '../forms/SignupForm';
import AuthFormContainer from '../forms/AuthFormContainer';

const SignupPage = () => {
  return (
    <Center flex='1'>
      <AuthFormContainer>
        <SignupForm />
      </AuthFormContainer>
    </Center>
  );
};

export default SignupPage;
