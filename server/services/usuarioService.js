const bcrypt = require('bcryptjs');

const prisma = require('../config/prisma');

const ROLES = ['ADMIN', 'GERENTE', 'VENDEDOR'];
const publicFields = {
  id: true,
  nome: true,
  email: true,
  ativo: true,
  role: true,
  createdAt: true,
  updatedAt: true
};

function isValidRole(role) {
  return !role || ROLES.includes(role);
}

async function list() {
  return prisma.usuario.findMany({
    select: publicFields,
    orderBy: { nome: 'asc' }
  });
}

async function create({ nome, email, senha, role }) {
  const senhaHash = await bcrypt.hash(senha, 10);

  return prisma.usuario.create({
    data: {
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      senha: senhaHash,
      role: role || 'VENDEDOR'
    },
    select: publicFields
  });
}

async function update(id, data) {
  const updateData = {};

  if (data.nome !== undefined) updateData.nome = data.nome.trim();
  if (data.email !== undefined) updateData.email = data.email.trim().toLowerCase();
  if (data.role !== undefined) updateData.role = data.role;
  if (data.ativo !== undefined) updateData.ativo = data.ativo;
  if (data.senha) updateData.senha = await bcrypt.hash(data.senha, 10);

  return prisma.usuario.update({
    where: { id },
    data: updateData,
    select: publicFields
  });
}

async function deactivate(id) {
  return update(id, { ativo: false });
}

module.exports = {
  ROLES,
  isValidRole,
  list,
  create,
  update,
  deactivate
};
