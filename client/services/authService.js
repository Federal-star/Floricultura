(function (window) {
  const API_BASE_URL = 'http://localhost:3000/api/v1';
  const TOKEN_KEY = 'floricultura_token';
  const USER_KEY = 'floricultura_usuario';

  async function login(email, senha) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    });

    const payload = await response.json();

    if (!response.ok || !payload.success) {
      throw new Error(payload.error || 'Não foi possível entrar. Tente novamente.');
    }

    localStorage.setItem(TOKEN_KEY, payload.data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(payload.data.usuario));

    return payload.data;
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  window.authService = {
    login,
    getToken,
    logout
  };
})(window);
