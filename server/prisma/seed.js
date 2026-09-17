const bcrypt = require('bcryptjs');

const prisma = require('../config/prisma');

async function main() {
  const senha = await bcrypt.hash('Flor@1234', 10);

  await prisma.usuario.upsert({
    where: { email: 'admin@floricultura.com' },
    update: { nome: 'Administrador', role: 'ADMIN', ativo: true },
    create: {
      nome: 'Administrador',
      email: 'admin@floricultura.com',
      senha,
      role: 'ADMIN'
    }
  });

  console.log('Usuário ADMIN inicial criado ou atualizado.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
