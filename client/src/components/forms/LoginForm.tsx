import { FcGoogle } from 'react-icons/fc';
import { Button, Field, Fieldset, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { login } from '@/api/authApi';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login: contextLogin } = useAuth();

  const handleSignin = async () => {
    const user = await login(username, password);
    contextLogin(user);
  };
  return (
    <Fieldset.Root size="lg" maxW="md">
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
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field.Root>

      <Button onClick={handleSignin}>Sign in</Button>
      <Button>
        Sign in with <FcGoogle />
      </Button>
    </Fieldset.Root>
  );
};

export default LoginForm;
