import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: 'Leslie S Fernandez',
      username: 'leslieshanell',
      password: '$2b$10$61/MvArRA5HhYSXvU1jL6O5Kt3/i8yGRNKiC2oEAItapzK7obTbmm',
    },
  });

  await prisma.user.create({
    data: {
      name: 'Liomard J Mesa',
      username: 'Ljaquel01',
      password: '$2b$10$bRX0Zj0FoJffnncDwPFc6eUfTtvn33tC7SgbEcdd6m1Jb4z/toM/G',
    },
  });

  await prisma.folder.create({
    data: {
      ownerId: 1,
      name: "Leslie's First Folder",
    },
  });

  await prisma.folder.create({
    data: {
      ownerId: 2,
      name: `LJ's First Folder`,
    },
  });

  // await prisma.file.create({
  //   data: {
  //     id: 1,
  //     ownerId: 1,
  //     name: 'locrio.jpeg',
  //     bucket: 'uploads',
  //     mimeType: 'image/jpeg',
  //     path: '1/home/locrio.jpeg',
  //     size: 339806,
  //     isFavorite: false,
  //   },
  // });
}

main()
  .then(() => {
    console.log('Seeding finished.');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
