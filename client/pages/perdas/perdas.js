document.addEventListener('DOMContentLoaded', () => {
  const formPerda = document.getElementById('formPerda');
  const produtoSelect = document.getElementById('produtoId');
  const quantidadeInput = document.getElementById('quantidade');
  const motivoSelect = document.getElementById('motivo');
  const observacaoInput = document.getElementById('observacao');
  const formFeedback = document.getElementById('form-feedback');
  const productStock = document.getElementById('product-stock');
  const tabela = document.getElementById('tabelaPerdasBody');
  const historyFeedback = document.getElementById('history-feedback');
  const reasonFilter = document.getElementById('reason-filter');
  const productFilter = document.getElementById('product-filter');
  const previousPage = document.getElementById('previous-page');
  const nextPage = document.getElementById('next-page');
  const pageIndicator = document.getElementById('page-indicator');
  const labels = { DETERIORACAO: 'Deterioração', AVARIA: 'Avaria', PRAGA: 'Praga', VALIDADE: 'Validade', OUTROS: 'Outros' };
  const escapeHtml = (value) => String(value || '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  const dateTime = (value) => new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  const getToken = () => (window.authService && authService.getToken()) || localStorage.getItem('token');
  let products = [];
  let page = 1;
  let pagination = { totalPages: 1 };

  async function request(path, options = {}) {
    const response = await fetch(`/api/v1${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`, ...(options.headers || {}) }
    });
    const payload = await response.json();
    if (!response.ok || !payload.success) throw new Error(payload.error || payload.message || 'Não foi possível concluir a operação.');
    return payload.data;
  }

  function preencherProdutos() {
    produtoSelect.innerHTML = '<option value="">Selecione um produto</option>' + products.map((product) => `<option value="${escapeHtml(product.id)}">${escapeHtml(product.nome)} (${escapeHtml(product.sku)}) - Estoque: ${product.quantidadeEstoque}</option>`).join('');
    productFilter.innerHTML = '<option value="">Todos os produtos</option>' + products.map((product) => `<option value="${escapeHtml(product.id)}">${escapeHtml(product.nome)} · ${escapeHtml(product.sku)}</option>`).join('');
  }

  function renderHistory(items) {
    tabela.innerHTML = items.map((loss) => `<tr><td data-label="Data / hora">${dateTime(loss.createdAt)}</td><td data-label="Produto"><strong>${escapeHtml(loss.produto.nome)}</strong><span class="sub-value">${escapeHtml(loss.produto.sku)}</span></td><td data-label="Quantidade" class="quantity-cell">${loss.quantidade}</td><td data-label="Motivo"><span class="reason-badge reason-${loss.motivo.toLowerCase()}">${labels[loss.motivo] || loss.motivo}</span></td><td data-label="Responsável">${escapeHtml(loss.usuario.nome)}</td><td data-label="Observação" class="observation">${escapeHtml(loss.observacao) || '<span class="muted">Sem observação</span>'}</td></tr>`).join('') || '<tr><td colspan="6" class="empty-state">Nenhuma perda registrada para os filtros selecionados.</td></tr>';
  }

  async function carregarProdutosSelect() {
    const result = await request('/produtos?page=1&pageSize=100');
    products = result.items || [];
    preencherProdutos();
  }

  async function carregarHistoricoPerdas() {
    historyFeedback.textContent = 'Carregando histórico...';
    const params = new URLSearchParams({ page, pageSize: 10 });
    if (reasonFilter.value) params.set('motivo', reasonFilter.value);
    if (productFilter.value) params.set('produtoId', productFilter.value);
    const result = await request(`/perdas?${params.toString()}`);
    pagination = result.pagination;
    renderHistory(result.items || []);
    pageIndicator.textContent = `Página ${pagination.page} de ${Math.max(pagination.totalPages, 1)}`;
    previousPage.disabled = page <= 1;
    nextPage.disabled = page >= pagination.totalPages;
    historyFeedback.textContent = pagination.total ? `${pagination.total} registros` : '';
  }

  produtoSelect.addEventListener('change', () => {
    const selected = products.find((product) => product.id === produtoSelect.value);
    productStock.textContent = selected ? `${selected.quantidadeEstoque} unidades disponíveis` : '';
    productStock.className = selected && selected.quantidadeEstoque <= 5 ? 'stock-hint is-low' : 'stock-hint';
  });

  formPerda.addEventListener('submit', registrarBaixaEstoque);
  reasonFilter.addEventListener('change', () => { page = 1; carregarHistoricoPerdas().catch((error) => { historyFeedback.textContent = error.message; }); });
  productFilter.addEventListener('change', () => { page = 1; carregarHistoricoPerdas().catch((error) => { historyFeedback.textContent = error.message; }); });
  previousPage.addEventListener('click', () => { if (page > 1) { page -= 1; carregarHistoricoPerdas(); } });
  nextPage.addEventListener('click', () => { if (page < pagination.totalPages) { page += 1; carregarHistoricoPerdas(); } });

  async function registrarBaixaEstoque(event) {
    event.preventDefault();
    const produtoId = produtoSelect.value;
    const quantidade = Number.parseInt(quantidadeInput.value, 10);
    const motivo = motivoSelect.value;
    const observacao = observacaoInput.value.trim();
    const selected = products.find((product) => product.id === produtoId);
    if (!produtoId || !selected) { formFeedback.textContent = 'Selecione um produto válido.'; formFeedback.className = 'feedback is-error'; return; }
    if (!Number.isInteger(quantidade) || quantidade <= 0 || quantidade > selected.quantidadeEstoque) { formFeedback.textContent = `Informe uma quantidade entre 1 e ${selected.quantidadeEstoque}.`; formFeedback.className = 'feedback is-error'; return; }
    const button = formPerda.querySelector('button[type="submit"]');
    button.disabled = true;
    try {
      await request('/perdas', { method: 'POST', body: JSON.stringify({ produtoId, quantidade, motivo, observacao }) });
      formPerda.reset();
      productStock.textContent = '';
      formFeedback.textContent = 'Baixa registrada e estoque atualizado.';
      formFeedback.className = 'feedback is-success';
      await carregarProdutosSelect();
      await carregarHistoricoPerdas();
    } catch (error) {
      formFeedback.textContent = error.message;
      formFeedback.className = 'feedback is-error';
    } finally { button.disabled = false; }
  }

  Promise.all([carregarProdutosSelect(), carregarHistoricoPerdas()]).catch((error) => { historyFeedback.textContent = error.message; historyFeedback.className = 'feedback is-error'; });
});
