const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const queryCreateUser = async (newUser) => {
  const user = await prisma.user.create({
    data: {
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
    },
    omit: {
      password: true,
    },
  });
  return user;
};

const queryCreateFolder = async (newFolder) => {
  const folder = await prisma.folder.create({
    data: {
      name: newFolder.name,
      ownerId: newFolder.ownerId,
    },
  });
  return folder;
};

const queryUserByUsername = async (username) => {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
    omit: {
      password: true,
    },
  });
  return user;
};

const queryUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });
  return user;
};

const queryAllFolders = async () => {
  const folders = await prisma.folder.findMany();
  return folders;
};

const queryFilesByFolderId = async (folderId) => {
  const files = await prisma.findMany({
    where: {
      folderId: folderId,
    },
  });
  return files;
};

const queryUpdateFolder = async (newFolder) => {
  const folder = await prisma.folder.update({
    where: {
      id: newFolder.id,
    },
    data: {
      name: newFolder.name,
    },
  });
  return folder;
};

const queryUpdateFile = async (newFile) => {
  const file = await prisma.file.update({
    where: {
      id: newFile.id,
    },
    data: {
      name: newFile.name,
    },
  });
  return file;
};

const queryDeleteFolder = async (folderId) => {
  const folder = await prisma.folder.delete({
    where: {
      id: folderId,
    },
  });
  return folder;
};

const queryDeleteFile = async (fileId) => {
  const file = await prisma.file.delete({
    where: {
      id: fileId,
    },
  });
  return file;
};

module.exports = {
  queryCreateUser,
  queryCreateFolder,
  queryUserByUsername,
  queryUserById,
  queryAllFolders,
  queryFilesByFolderId,
  queryUpdateFolder,
  queryUpdateFile,
  queryDeleteFolder,
  queryDeleteFile,
};
