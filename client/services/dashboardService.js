(function (window) {
  const API_BASE_URL = 'http://localhost:3000/api/v1';

  async function request(path) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
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
