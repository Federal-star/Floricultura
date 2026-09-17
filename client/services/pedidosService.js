(function (window) {
  const API_BASE_URL = 'http://localhost:3000/api/v1';

  async function create(data) {
    const response = await fetch(`${API_BASE_URL}/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authService.getToken()}`
      },
      body: JSON.stringify(data)
    });
    const payload = await response.json();
    if (!response.ok || !payload.success) throw new Error(payload.error || 'Não foi possível finalizar a venda.');
    return payload.data;
  }

  window.pedidosService = { create };
})(window);
