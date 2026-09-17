(function () {
  const feedback = document.querySelector('#dashboard-feedback');
  const paymentLabels = { DINHEIRO: 'Dinheiro', PIX: 'PIX', CARTAO_CREDITO: 'Cartão de crédito', CARTAO_DEBITO: 'Cartão de débito' };
  const currency = (value) => Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const escapeHtml = (value) => String(value || '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));

  function renderPayments(items) {
    const maximum = Math.max(...items.map((item) => Number(item.faturamento)), 1);
    document.querySelector('#payment-list').innerHTML = items.map((item) => `<div class="payment-row"><div class="payment-meta"><span>${paymentLabels[item.formaPagamento]}</span><strong>${currency(item.faturamento)}</strong></div><div class="payment-bar"><span style="width: ${Math.round((Number(item.faturamento) / maximum) * 100)}%"></span></div><small>${item.quantidadeVendas} ${item.quantidadeVendas === 1 ? 'venda' : 'vendas'}</small></div>`).join('');
  }

  function renderCriticalProducts(products) {
    document.querySelector('#critical-products').innerHTML = products.map((product) => `<tr><td data-label="Produto"><strong>${escapeHtml(product.nome)}</strong><span>${escapeHtml(product.categoria)}</span></td><td data-label="SKU">${escapeHtml(product.sku)}</td><td data-label="Saldo"><span class="critical-stock ${product.quantidadeEstoque === 0 ? 'is-empty' : ''}">${product.quantidadeEstoque} un.</span></td></tr>`).join('') || '<tr><td colspan="3" class="empty-state">Nenhum produto em nível crítico.</td></tr>';
  }

  async function loadDashboard() {
    feedback.textContent = 'Atualizando indicadores...';
    feedback.className = 'feedback';
    try {
      const [kpis, payments] = await Promise.all([dashboardService.getKpis(), dashboardService.getSalesByPayment()]);
      document.querySelector('#revenue-kpi').textContent = currency(kpis.faturamentoDia);
      document.querySelector('#sales-kpi').textContent = kpis.vendasHoje;
      document.querySelector('#loss-kpi').textContent = kpis.perdasNoMes.quantidade;
      document.querySelector('#alert-kpi').textContent = kpis.produtosEmAlerta;
      renderPayments(payments);
      renderCriticalProducts(kpis.produtosCriticos);
      feedback.textContent = `Atualizado às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } catch (error) {
      feedback.textContent = error.message;
      feedback.className = 'feedback is-error';
    }
  }

  document.querySelector('#refresh-dashboard').addEventListener('click', loadDashboard);
  loadDashboard();
})();
