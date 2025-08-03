import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { Button, Field, Fieldset, Input, Text } from '@chakra-ui/react';
import useLogin from '@/hooks/useLogin';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod/v4';

const schema = z.object({
  username: z.string().trim().min(3),
  password: z.string().min(4),
});

type FormFields = z.infer<typeof schema>;

const LoginForm = () => {
  const { mutate: login } = useLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: zodResolver(schema),
  });

  const handleLogin: SubmitHandler<FormFields> = async (data) => {
    await login(data, {
      onError: () => {
        setError('root', {
          message: 'Wrong credentials please try again',
        });
      },
    });
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/login/google`;
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      <Fieldset.Root size="lg" maxW="md">
        <Fieldset.Legend fontSize="xl">Sign in to your account</Fieldset.Legend>
        <Field.Root>
          <Field.Label id="username">Username: </Field.Label>
          <Input placeholder="Enter your username" {...register('username')} />
          {errors.username && (
            <Text color={'fg.error'}>{errors.username.message}</Text>
          )}
        </Field.Root>
        <Field.Root>
          <Field.Label id="password">Password: </Field.Label>
          <Input
            placeholder="Enter your password"
            type="password"
            {...register('password')}
          />
          {errors.password && (
            <Text color={'fg.error'}>{errors.password.message}</Text>
          )}
        </Field.Root>

        {errors.root && <Text color={'fg.error'}>{errors.root.message}</Text>}

        <Button type="submit">
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
        <Button onClick={handleGoogleLogin}>
          Sign in with <FcGoogle />
        </Button>

        <Link to="/sign-up">Create an account</Link>
      </Fieldset.Root>
    </form>
  );
};

export default LoginForm;
