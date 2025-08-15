import { FcGoogle } from 'react-icons/fc';
import { Button, Field, Fieldset, Input, Text } from '@chakra-ui/react';

import { Link, useNavigate } from 'react-router-dom';
import useSignup from '@/hooks/useSignup';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod/v4';

const schema = z.object({
  name: z.string().trim().min(3),
  username: z.string().trim().min(3),
  password: z.string().min(4),
});

type FormFields = z.infer<typeof schema>;

const SignupForm = () => {
  const { mutate: signup } = useSignup();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      name: '',
      username: '',
      password: '',
    },
    resolver: zodResolver(schema),
  });

  const handleSignup: SubmitHandler<FormFields> = async (data) => {
    await signup(data);
    navigate('/');
  };
  return (
    <form>
      <Fieldset.Root>
        <Fieldset.Legend fontSize='xl'>Create an account</Fieldset.Legend>
        <Field.Root>
          <Field.Label id='name'>Name: </Field.Label>
          <Input placeholder='Enter your name' {...register('name')} />
          {errors.name && <Text color={'fg.error'}>{errors.name.message}</Text>}
        </Field.Root>

        <Field.Root>
          <Field.Label id='username'>Username: </Field.Label>
          <Input placeholder='Enter your username' {...register('username')} />
          {errors.username && (
            <Text color={'fg.error'}>{errors.username.message}</Text>
          )}
        </Field.Root>

        <Field.Root>
          <Field.Label id='password'>Password: </Field.Label>
          <Input
            placeholder='Enter your password'
            type='password'
            {...register('password')}
          />
          {errors.password && (
            <Text color={'fg.error'}>{errors.password.message}</Text>
          )}
        </Field.Root>

        <Button type='submit' onClick={handleSubmit(handleSignup)}>
          Create account
        </Button>
        <Button>
          Sign up with <FcGoogle />
        </Button>
        <Link to={'/login'}>Already have an account? Login instead</Link>
      </Fieldset.Root>
    </form>
  );
};

export default SignupForm;
