(function (window) {

  async function request(path) {
    const response = await fetch(`${window.API_BASE_URL}${path}`, {
      headers: { Authorization: `Bearer ${authService.getToken()}` }
    });
    const payload = await response.json();
    if (!response.ok || !payload.success) throw new Error(payload.error || 'Não foi possível carregar o dashboard.');
    return payload.data;
  }

  window.dashboardService = {
    getKpis: () => request('/dashboard/kpis'),
    getSalesByPayment: () => request('/dashboard/vendas-por-pagamento')
  };
})(window);
