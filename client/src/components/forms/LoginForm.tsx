import { FcGoogle } from 'react-icons/fc';
import { Button, Field, Fieldset, Input, Box } from '@chakra-ui/react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { login } from '@/api/authApi';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login: contextLogin } = useAuth();

  const handleSignin = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const user = await login(username, password);
    contextLogin(user);
  };
  return (
    <Box
      as="form"
      maxW="md"
      minW="sm"
      mx="auto"
      p={8}
      borderWidth={1}
      borderRadius="lg"
      bg="gray.subtle"
      boxShadow="md"
      onSubmit={handleSignin}
    >
      <Fieldset.Root size="lg" maxW="md">
        <Fieldset.Legend fontSize="xl">Sign in to your account</Fieldset.Legend>
        <Field.Root>
          <Field.Label id="username">Username: </Field.Label>
          <Input
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label id="password">Password: </Field.Label>
          <Input
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field.Root>

        <Button type="submit">Sign in</Button>
        <Button>
          Sign in with <FcGoogle />
        </Button>

        <Link to="/sign-up">Create an account</Link>
      </Fieldset.Root>
    </Box>
  );
};

export default LoginForm;
