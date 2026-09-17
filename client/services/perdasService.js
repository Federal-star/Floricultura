(function (window) {
  const API_BASE_URL = 'http://localhost:3000/api/v1';

  async function request(path, options) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authService.getToken()}`,
        ...(options && options.headers)
      }
    });
    const payload = await response.json();
    if (!response.ok || !payload.success) throw new Error(payload.error || 'Não foi possível concluir a operação.');
    return payload.data;
  }

  window.perdasService = {
    list: (page, pageSize, motivo, produtoId) => {
      const params = new URLSearchParams({ page, pageSize });
      if (motivo) params.set('motivo', motivo);
      if (produtoId) params.set('produtoId', produtoId);
      return request(`/perdas?${params.toString()}`);
    },
    create: (data) => request('/perdas', { method: 'POST', body: JSON.stringify(data) })
  };
})(window);
