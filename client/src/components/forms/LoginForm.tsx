import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { Button, Field, Fieldset, Input } from '@chakra-ui/react';
import { useAuth } from '@/hooks/useAuth';
import { login } from '@/api/authApi';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login: contextLogin } = useAuth();

  const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = await login(username, password);
    contextLogin(user);
  };

  return (
    <form onSubmit={handleSignin}>
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
    </form>
  );
};

export default LoginForm;
