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

    if (!response.ok || !payload.success) {
      throw new Error(payload.error || 'Não foi possível concluir a operação.');
    }

    return payload.data;
  }

  window.usuariosService = {
    list: () => request('/usuarios'),
    create: (data) => request('/usuarios', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id) => request(`/usuarios/${id}`, { method: 'DELETE' })
  };
})(window);
