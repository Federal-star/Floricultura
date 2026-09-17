(function () {
  const productSearch = document.querySelector('#product-search');
  const productId = document.querySelector('#product-id');
  const productOptions = document.querySelector('#product-options');
  const productStock = document.querySelector('#product-stock');
  const form = document.querySelector('#loss-form');
  const formFeedback = document.querySelector('#form-feedback');
  const table = document.querySelector('#losses-table');
  const historyFeedback = document.querySelector('#history-feedback');
  const reasonFilter = document.querySelector('#reason-filter');
  const productFilter = document.querySelector('#product-filter');
  const previousPage = document.querySelector('#previous-page');
  const nextPage = document.querySelector('#next-page');
  const pageIndicator = document.querySelector('#page-indicator');
  const labels = { DETERIORACAO: 'Deterioração', AVARIA: 'Avaria', PRAGA: 'Praga', VALIDADE: 'Validade', OUTROS: 'Outros' };
  const escapeHtml = (value) => String(value || '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  const dateTime = (value) => new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  let products = [];
  let page = 1;
  let pagination = { totalPages: 1 };

  function fillProductOptions() {
    productOptions.innerHTML = products.map((product) => `<option value="${escapeHtml(product.nome)} - ${escapeHtml(product.sku)}"></option>`).join('');
    productFilter.innerHTML = '<option value="">Todos os produtos</option>' + products.map((product) => `<option value="${product.id}">${escapeHtml(product.nome)} · ${escapeHtml(product.sku)}</option>`).join('');
  }

  function selectProduct() {
    const selected = products.find((product) => `${product.nome} - ${product.sku}` === productSearch.value);
    productId.value = selected ? selected.id : '';
    productStock.textContent = selected ? `${selected.quantidadeEstoque} unidades disponíveis` : '';
    productStock.className = selected && selected.quantidadeEstoque <= 5 ? 'stock-hint is-low' : 'stock-hint';
  }

  function renderHistory(items) {
    table.innerHTML = items.map((loss) => `<tr><td data-label="Data / hora">${dateTime(loss.createdAt)}</td><td data-label="Produto"><strong>${escapeHtml(loss.produto.nome)}</strong><span class="sub-value">${escapeHtml(loss.produto.sku)}</span></td><td data-label="Quantidade" class="quantity-cell">${loss.quantidade}</td><td data-label="Motivo"><span class="reason-badge reason-${loss.motivo.toLowerCase()}">${labels[loss.motivo]}</span></td><td data-label="Responsável">${escapeHtml(loss.usuario.nome)}</td><td data-label="Observação" class="observation">${escapeHtml(loss.observacao) || '<span class="muted">Sem observação</span>'}</td></tr>`).join('') || '<tr><td colspan="6" class="empty-state">Nenhuma perda registrada para os filtros selecionados.</td></tr>';
  }

  async function loadHistory() {
    historyFeedback.textContent = 'Carregando histórico...';
    try {
      const result = await perdasService.list(page, 10, reasonFilter.value, productFilter.value);
      pagination = result.pagination;
      renderHistory(result.items);
      pageIndicator.textContent = `Página ${pagination.page} de ${Math.max(pagination.totalPages, 1)}`;
      previousPage.disabled = page <= 1;
      nextPage.disabled = page >= pagination.totalPages;
      historyFeedback.textContent = pagination.total ? `${pagination.total} registros` : '';
    } catch (error) {
      historyFeedback.textContent = error.message;
      historyFeedback.className = 'feedback is-error';
    }
  }

  async function loadProducts() {
    const result = await produtosService.list(1, 100, '', '');
    products = result.items;
    fillProductOptions();
  }

  productSearch.addEventListener('input', selectProduct);
  reasonFilter.addEventListener('change', () => { page = 1; loadHistory(); });
  productFilter.addEventListener('change', () => { page = 1; loadHistory(); });
  previousPage.addEventListener('click', () => { if (page > 1) { page -= 1; loadHistory(); } });
  nextPage.addEventListener('click', () => { if (page < pagination.totalPages) { page += 1; loadHistory(); } });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    formFeedback.textContent = '';
    const selected = products.find((product) => product.id === productId.value);
    const quantity = Number(document.querySelector('#loss-quantity').value);
    if (!selected) { formFeedback.textContent = 'Selecione um produto válido da lista.'; formFeedback.className = 'feedback is-error'; return; }
    if (!Number.isInteger(quantity) || quantity <= 0 || quantity > selected.quantidadeEstoque) { formFeedback.textContent = `Informe uma quantidade entre 1 e ${selected.quantidadeEstoque}.`; formFeedback.className = 'feedback is-error'; return; }

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Registrando...';
    try {
      await perdasService.create({ produtoId: selected.id, quantidade, motivo: document.querySelector('#loss-reason').value, observacao: document.querySelector('#loss-note').value.trim() });
      form.reset(); productId.value = ''; productStock.textContent = ''; formFeedback.textContent = 'Baixa registrada e estoque atualizado.'; formFeedback.className = 'feedback is-success';
      await loadProducts();
      await loadHistory();
    } catch (error) { formFeedback.textContent = error.message; formFeedback.className = 'feedback is-error'; }
    finally { button.disabled = false; button.textContent = 'Registrar baixa'; }
  });

  Promise.all([loadProducts(), loadHistory()]).catch((error) => { historyFeedback.textContent = error.message; historyFeedback.className = 'feedback is-error'; });
})();
