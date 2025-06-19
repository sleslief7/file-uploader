import { FcGoogle } from 'react-icons/fc';
import { Box, Button, Field, Fieldset, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { signup } from '@/api/authApi';
import type { UserSignUpRequest } from '@/interfaces/UserInterface';
import { useNavigate } from 'react-router-dom';
import { toaster } from '../ui/toaster';

const useSignup = () => {
  const { mutate } = useMutation({
    mutationFn: (user: UserSignUpRequest) => signup(user),
    onSuccess: () => {
      toaster.create({
        title: 'You have signup successfully!',
        type: 'success',
      });
    },
  });

  return mutate;
};

const SignupForm = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const signup = useSignup();
  const navigate = useNavigate();

  const handleSignup = () => {
    const user = {
      name,
      username,
      password,
    };
    signup(user);
    navigate('/');
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
    >
      <Fieldset.Root>
        <Fieldset.Legend fontSize="xl">Create an account</Fieldset.Legend>
        <Field.Root>
          <Field.Label id="name">Name: </Field.Label>
          <Input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field.Root>

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
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field.Root>

        <Button onClick={handleSignup}>Create account</Button>
        <Button>
          Sign up with <FcGoogle />
        </Button>
      </Fieldset.Root>
    </Box>
  );
};

export default SignupForm;
