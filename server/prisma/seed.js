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

  const produtos = [
    {
      sku: 'PLA-ORQ-001',
      nome: 'Orquídea Phalaenopsis',
      categoria: 'PLANTA',
      precoVenda: '89.90',
      quantidadeEstoque: 12,
      descricao: 'Orquídea elegante para ambientes internos.',
      rega: '2x por semana',
      iluminacao: 'Meia-sombra',
      cuidados: 'Evitar água acumulada no centro das folhas.'
    },
    {
      sku: 'VAS-CER-001',
      nome: 'Vaso de Cerâmica Terracota',
      categoria: 'VASO',
      precoVenda: '54.90',
      quantidadeEstoque: 18,
      descricao: 'Vaso artesanal em cerâmica esmaltada.'
    },
    {
      sku: 'INS-ADU-001',
      nome: 'Adubo Orgânico',
      categoria: 'INSUMO',
      precoVenda: '24.90',
      quantidadeEstoque: 0,
      descricao: 'Adubo orgânico para nutrição de plantas.'
    }
  ];

  for (const produto of produtos) {
    await prisma.produto.upsert({
      where: { sku: produto.sku },
      update: produto,
      create: produto
    });
  }

  console.log('Usuário ADMIN e produtos base criados ou atualizados.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
