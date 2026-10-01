(function (window) {
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  }

  function formatCurrency(value) {
    return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function normalizeWhatsappPhone(value) {
    const phone = String(value ?? '').replace(/\D/g, '');
    if (phone.length === 10 || phone.length === 11) return `55${phone}`;
    if ((phone.length === 12 || phone.length === 13) && phone.startsWith('55')) return phone;
    return null;
  }

  function buildCareGuideMessage(cliente, itens) {
    const botanicalItems = (itens || []).map((item) => item.produto).filter((produto) => produto && [produto.rega, produto.iluminacao, produto.cuidados, produto.usos].some(Boolean));
    let message = `Olá, *${cliente.nome}*!\n\nObrigado por comprar na *Floricultura*!\nAqui está o seu *Guia Prático de Cuidados*:\n\n`;
    botanicalItems.forEach((produto) => {
      message += `🌿 *${produto.nome}*\n`;
      if (produto.rega) message += `💧 *Rega:* ${produto.rega}\n`;
      if (produto.iluminacao) message += `☀️ *Iluminação:* ${produto.iluminacao}\n`;
      if (produto.cuidados) message += `🪴 *Cuidados:* ${produto.cuidados}\n`;
      if (produto.usos) message += `🌱 *Usos e benefícios:* ${produto.usos}\n`;
      message += '\n';
    });
    return `${message}Qualquer dúvida sobre o cultivo, estamos à disposição. Tenha um ótimo dia!`;
  }

  const utils = { escapeHtml, formatCurrency, normalizeWhatsappPhone, buildCareGuideMessage };
  window.floriculturaUtils = utils;
  if (typeof module !== 'undefined' && module.exports) module.exports = utils;
})(typeof window === 'undefined' ? globalThis : window);