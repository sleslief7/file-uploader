import { Flex } from '@chakra-ui/react';
import SignupForm from '../forms/SignupForm';

const SignUpPage = () => {
  return (
    <Flex direction="column" p={4} flex="1" justifyContent="center">
      <SignupForm />
    </Flex>
  );
};

export default SignUpPage;
