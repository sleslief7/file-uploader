import { Box } from '@chakra-ui/react';

type AuthFormContainerProps = {
  children: React.ReactNode;
};

const AuthFormContainer = ({ children }: AuthFormContainerProps) => {
  return (
    <Box
      maxW="md"
      minW="sm"
      p={8}
      borderWidth={1}
      borderRadius="md"
      bg="gray.subtle"
      boxShadow="md"
    >
      {children}
    </Box>
  );
};

export default AuthFormContainer;
