import { FcGoogle } from 'react-icons/fc';
import { Button, Field, Fieldset, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSignup from '@/hooks/useSignup';

const SignupForm = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: signup } = useSignup();
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
    <form>
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
    </form>
  );
};

export default SignupForm;
