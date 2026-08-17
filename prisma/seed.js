import 'dotenv/config';
import { PrismaClient, Role } from '../generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL
  })
});

async function main() {
  // Limpiar usuarios anteriores
  await prisma.user.deleteMany();
  console.log('Usuarios anteriores eliminados.');

  // Crear usuarios de prueba con el esquema actual
  const users = [
    {
      name: 'Admin Demo',
      email: 'admin@ejemplo.com',
      password: 'passwordSegura123',
      role: Role.ADMIN,
    },
    {
      name: 'Usuario Demo 1',
      email: 'user1@ejemplo.com',
      password: 'passwordSegura123',
      role: Role.USER,
    },
    {
      name: 'Usuario Demo 2',
      email: 'user2@ejemplo.com',
      password: 'passwordSegura123',
      role: Role.USER,
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  console.log('Usuarios de demostración creados con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });