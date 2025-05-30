const prisma = require('./prisma');
import { Prisma, User } from '../../generated/prisma';
import type { UserWithoutPassword } from '../interfaces';

export const createUser = async (
  newUser: Prisma.UserCreateInput,
  omitPassword: boolean = false
): Promise<User | UserWithoutPassword> => {
  const user = await prisma.user.create({
    data: {
      ...newUser,
    },
    omit: {
      password: omitPassword,
    },
  });
  return user;
};

export const getUserById = async (userId: number): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  return user;
};

export const getUserByUsername = async (
  username: string
): Promise<User | null> => {
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  });
  return user;
};

export const updateUser = async (
  userId: number,
  data: Prisma.UserUpdateInput,
  omitPassword: boolean = false
): Promise<User | UserWithoutPassword> => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data,
    omit: {
      password: omitPassword,
    },
  });
  return user;
};

export const userExists = async (username: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  });
  return user;
};
