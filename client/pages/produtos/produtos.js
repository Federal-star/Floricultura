(function () {
  const user = authService.getUser();
  const canEdit = user && ['ADMIN', 'GERENTE'].includes(user.role);
  const canRemove = user && user.role === 'ADMIN';
  const table = document.querySelector('#products-table');
  const feedback = document.querySelector('#catalog-feedback');
  const modal = document.querySelector('#product-modal');
  const form = document.querySelector('#product-form');
  const modalFeedback = document.querySelector('#modal-feedback');
  const drawer = document.querySelector('#botanical-drawer');
  const drawerImage = document.querySelector('#botanical-image');
  const drawerFeedback = document.querySelector('#catalog-feedback');
  let page = 1;
  let pagination = { totalPages: 1 };

  document.querySelector('#new-product').disabled = !canEdit;
  document.querySelector('#new-product').title = canEdit ? 'Criar novo produto' : 'Apenas administradores e gerentes podem criar produtos';
  const labels = { PLANTA: 'Planta', VASO: 'Vaso', INSUMO: 'Insumo', ARRANJO: 'Arranjo', OUTROS: 'Outros' };
  const money = (value) => Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const escapeHtml = (value) => String(value || '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));

  function stockStatus(quantity) { if (quantity === 0) return '<span class="stock-badge stock-empty">Esgotado</span>'; if (quantity <= 5) return `<span class="stock-badge stock-low">${quantity} un. · baixo</span>`; return `<span class="stock-badge stock-ok">${quantity} un.</span>`; }
  function openBotanicalCard(product) {
    document.querySelector('#botanical-title').textContent = product.nome;
    document.querySelector('#botanical-description').textContent = product.descricao || 'Uma planta especial para compor ambientes com vida.';
    document.querySelector('#botanical-watering').textContent = product.rega || 'Informação não cadastrada';
    document.querySelector('#botanical-light').textContent = product.iluminacao || 'Informação não cadastrada';
    document.querySelector('#botanical-care').textContent = product.cuidados || 'Informação não cadastrada';
    drawerImage.innerHTML = product.imagemUrl ? `<img src="${escapeHtml(product.imagemUrl)}" alt="${escapeHtml(product.nome)}" />` : '<span aria-hidden="true">✿</span>';
    drawer.hidden = false;
    document.querySelector('#close-drawer').focus();
  }
  function closeBotanicalCard() { drawer.hidden = true; }
  function render(items) {
    table.innerHTML = items.map((product) => `<tr><td data-label="Produto"><div class="product-cell"><div class="thumbnail">${product.imagemUrl ? `<img src="${escapeHtml(product.imagemUrl)}" alt="" />` : '<span aria-hidden="true">✿</span>'}</div><strong>${escapeHtml(product.nome)}</strong></div></td><td data-label="SKU" class="sku">${escapeHtml(product.sku)}</td><td data-label="Categoria"><span class="category-badge">${labels[product.categoria]}</span></td><td data-label="Preço" class="price">${money(product.precoVenda)}</td><td data-label="Estoque">${stockStatus(product.quantidadeEstoque)}</td><td class="row-actions">${product.categoria === 'PLANTA' ? `<button class="text-button botanical-button" data-botanical="${product.id}" type="button">Ver ficha técnica</button>` : ''}${canEdit ? `<button class="text-button" data-edit="${product.id}" type="button">Editar</button>` : ''}${canRemove && product.ativo ? `<button class="text-button danger" data-remove="${product.id}" type="button">Inativar</button>` : ''}</td></tr>`).join('') || '<tr><td colspan="6" class="empty-state">Nenhum produto encontrado.</td></tr>';
  }
  async function load() { feedback.textContent = 'Carregando...'; try { const result = await produtosService.list(page, 10, document.querySelector('#category-filter').value); pagination = result.pagination; render(result.items); document.querySelector('#page-indicator').textContent = `Página ${pagination.page} de ${Math.max(pagination.totalPages, 1)}`; document.querySelector('#previous-page').disabled = page <= 1; document.querySelector('#next-page').disabled = page >= pagination.totalPages; feedback.textContent = pagination.total ? `${pagination.total} produtos` : ''; } catch (error) { feedback.textContent = error.message; feedback.classList.add('is-error'); } }
  function toggleBotanical() { document.querySelector('#botanical-fields').hidden = document.querySelector('#product-category').value !== 'PLANTA'; }
  function openModal(product) { form.reset(); modalFeedback.textContent = ''; document.querySelector('#product-id').value = product ? product.id : ''; document.querySelector('#modal-title').textContent = product ? 'Editar produto' : 'Novo produto'; if (product) { document.querySelector('#product-name').value = product.nome; document.querySelector('#product-sku').value = product.sku; document.querySelector('#product-category').value = product.categoria; document.querySelector('#product-price').value = product.precoVenda; document.querySelector('#product-stock').value = product.quantidadeEstoque; document.querySelector('#product-image').value = product.imagemUrl || ''; document.querySelector('#product-description').value = product.descricao || ''; document.querySelector('#product-watering').value = product.rega || ''; document.querySelector('#product-light').value = product.iluminacao || ''; document.querySelector('#product-care').value = product.cuidados || ''; } toggleBotanical(); modal.hidden = false; document.querySelector('#product-name').focus(); }
  function closeModal() { modal.hidden = true; }
  document.querySelector('#new-product').addEventListener('click', () => { if (canEdit) openModal(); }); document.querySelector('#close-modal').addEventListener('click', closeModal); modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); }); document.querySelector('#close-drawer').addEventListener('click', closeBotanicalCard); drawer.addEventListener('click', (event) => { if (event.target === drawer) closeBotanicalCard(); }); document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeModal(); closeBotanicalCard(); } }); document.querySelector('#product-category').addEventListener('change', toggleBotanical); document.querySelector('#category-filter').addEventListener('change', () => { page = 1; load(); }); document.querySelector('#previous-page').addEventListener('click', () => { if (page > 1) { page -= 1; load(); } }); document.querySelector('#next-page').addEventListener('click', () => { if (page < pagination.totalPages) { page += 1; load(); } });
  table.addEventListener('click', async (event) => { if (!event.target.dataset.botanical) return; drawerFeedback.textContent = 'Carregando ficha...'; try { const product = await produtosService.detail(event.target.dataset.botanical); openBotanicalCard(product); } catch (error) { drawerFeedback.textContent = error.message; drawerFeedback.classList.add('is-error'); } });
  table.addEventListener('click', async (event) => { const product = event.target.dataset.edit && event.target.closest('tr'); if (event.target.dataset.edit) { const name = product.querySelector('strong').textContent; const result = await produtosService.list(1, 100); openModal(result.items.find((item) => item.id === event.target.dataset.edit) || { nome: name }); } if (event.target.dataset.remove && window.confirm('Inativar este produto?')) { try { await produtosService.remove(event.target.dataset.remove); await load(); } catch (error) { feedback.textContent = error.message; feedback.classList.add('is-error'); } } });
  form.addEventListener('submit', async (event) => { event.preventDefault(); modalFeedback.textContent = ''; const id = document.querySelector('#product-id').value; const data = { nome: document.querySelector('#product-name').value.trim(), sku: document.querySelector('#product-sku').value.trim(), categoria: document.querySelector('#product-category').value, precoVenda: Number(document.querySelector('#product-price').value), quantidadeEstoque: Number(document.querySelector('#product-stock').value), imagemUrl: document.querySelector('#product-image').value.trim(), descricao: document.querySelector('#product-description').value.trim(), rega: document.querySelector('#product-watering').value.trim(), iluminacao: document.querySelector('#product-light').value.trim(), cuidados: document.querySelector('#product-care').value.trim() }; try { if (id) await produtosService.update(id, data); else await produtosService.create(data); closeModal(); await load(); } catch (error) { modalFeedback.textContent = error.message; modalFeedback.classList.add('is-error'); } });
  load();
})();
