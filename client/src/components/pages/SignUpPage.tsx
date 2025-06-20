import { Flex } from '@chakra-ui/react';
import SignupForm from '../forms/SignupForm';

const SignupPage = () => {
  return (
    <Flex direction="column" p={4} flex="1" justifyContent="center">
      <SignupForm />
    </Flex>
  );
};

export default SignupPage;
