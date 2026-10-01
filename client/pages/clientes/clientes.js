document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formCliente');
  form.addEventListener('submit', salvarCliente);
  carregarClientes();
});

const getToken = () => (window.authService && authService.getToken()) || localStorage.getItem('token');
const { escapeHtml } = window.floriculturaUtils;

async function request(path, options = {}) {
  const response = await fetch(`/api/v1${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`, ...(options.headers || {}) }
  });
  const payload = await response.json();
  if (!response.ok || !payload.success) throw new Error(payload.error || payload.message || 'Não foi possível concluir a operação.');
  return payload.data;
}

async function carregarClientes() {
  const tabela = document.getElementById('tabelaClientesBody');
  const feedback = document.getElementById('list-feedback');
  try {
    feedback.textContent = 'Carregando clientes...';
    const clientes = await request('/clientes');
    tabela.innerHTML = clientes.map((cliente) => `<tr><td data-label="Nome"><strong>${escapeHtml(cliente.nome)}</strong></td><td data-label="CPF/CNPJ">${escapeHtml(cliente.cpfCnpj) || '-'}</td><td data-label="Telefone">${escapeHtml(cliente.telefone) || '-'}</td><td data-label="E-mail">${escapeHtml(cliente.email) || '-'}</td></tr>`).join('') || '<tr><td colspan="4" class="empty-state">Nenhum cliente cadastrado.</td></tr>';
    document.getElementById('client-count').textContent = `${clientes.length} ${clientes.length === 1 ? 'cadastro' : 'cadastros'}`;
    feedback.textContent = '';
  } catch (error) {
    feedback.textContent = error.message;
    feedback.className = 'feedback is-error';
  }
}

async function salvarCliente(event) {
  event.preventDefault();
  const feedback = document.getElementById('form-feedback');
  const button = event.target.querySelector('button[type="submit"]');
  const payload = {
    nome: document.getElementById('nome').value,
    cpfCnpj: document.getElementById('cpfCnpj').value,
    email: document.getElementById('email').value,
    telefone: document.getElementById('telefone').value,
    endereco: document.getElementById('endereco').value
  };

  button.disabled = true;
  try {
    await request('/clientes', { method: 'POST', body: JSON.stringify(payload) });
    event.target.reset();
    feedback.textContent = 'Cliente cadastrado com sucesso.';
    feedback.className = 'feedback is-success';
    await carregarClientes();
  } catch (error) {
    feedback.textContent = error.message;
    feedback.className = 'feedback is-error';
  } finally {
    button.disabled = false;
  }
}
