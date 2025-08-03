const prisma = require('./prisma');
import { Prisma, User } from '../../generated/prisma';
import type { UserWithoutPassword } from '../interfaces';
import { Profile as GoogleProfile } from 'passport-google-oauth20';

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

export const getUserById = async (
  userId: number,
  omitPassword: boolean = false
): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: omitPassword,
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

export const findOrCreateGoogleUser = async (
  profile: GoogleProfile
): Promise<User> => {
  let user = await findUserByGoogleId(profile.id);

  if (!user) {
    const newUserInput: Prisma.UserCreateInput = {
      name: profile.displayName,
      username: profile.displayName,
      googleId: profile.id,
      email: profile.emails![0].value,
      profileImgUrl: profile.photos ? profile.photos[0].value : null,
    };

    user = (await createUser(newUserInput)) as User;
  }

  return user!;
};

export const findUserByGoogleId = async (
  googleId: string
): Promise<User | null> => {
  const user = await prisma.user.findFirst({
    where: {
      googleId,
    },
  });
  return user;
};
