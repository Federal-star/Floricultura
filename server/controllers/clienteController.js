const prisma = require('../config/prisma');

async function listarClientes(req, res, next) {
  try {
    const clientes = await prisma.cliente.findMany({ orderBy: { createdAt: 'desc' } });
    return res.status(200).json({ success: true, data: clientes });
  } catch (error) {
    return next(error);
  }
}

async function criarCliente(req, res, next) {
  try {
    const { nome, cpfCnpj, email, telefone, endereco } = req.body;
    const normalizedName = typeof nome === 'string' ? nome.trim() : '';

    if (!normalizedName) {
      return res.status(400).json({ success: false, error: 'O nome do cliente é obrigatório.' });
    }

    const cliente = await prisma.cliente.create({
      data: {
        nome: normalizedName,
        cpfCnpj: cpfCnpj?.trim() || null,
        email: email?.trim() || null,
        telefone: telefone?.trim() || null,
        endereco: endereco?.trim() || null
      }
    });

    return res.status(201).json({ success: true, data: cliente });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ success: false, error: 'CPF/CNPJ já cadastrado.' });
    }
    return next(error);
  }
}

module.exports = { listarClientes, criarCliente };