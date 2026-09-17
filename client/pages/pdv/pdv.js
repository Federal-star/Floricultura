(function () {
  const CART_KEY = 'floricultura_pdv_carrinho';
  const productGrid = document.querySelector('#product-grid');
  const productFeedback = document.querySelector('#product-feedback');
  const productsCount = document.querySelector('#products-count');
  const cartItems = document.querySelector('#cart-items');
  const discountInput = document.querySelector('#discount');
  const clearCartButton = document.querySelector('#clear-cart');
  const continueButton = document.querySelector('#continue-sale');
  const checkoutModal = document.querySelector('#checkout-modal');
  const checkoutForm = document.querySelector('#checkout-form');
  const paymentMethod = document.querySelector('#payment-method');
  const cashFields = document.querySelector('#cash-fields');
  const amountReceived = document.querySelector('#amount-received');
  const changeValue = document.querySelector('#change-value');
  const checkoutFeedback = document.querySelector('#checkout-feedback');
  const confirmSaleButton = document.querySelector('#confirm-sale');
  const currency = (value) => Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const escapeHtml = (value) => String(value || '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  let products = [];
  let cart = loadCart();
  let discount = 0;

  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      return Array.isArray(saved) ? saved.filter((item) => item && item.id && item.quantity > 0) : [];
    } catch (error) {
      return [];
    }
  }

  function persistCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function calculateSubtotal() {
    return cart.reduce((total, item) => total + Number(item.precoVenda) * item.quantity, 0);
  }

  function stockLabel(quantity) {
    if (quantity <= 5) return `<span class="stock-warning">${quantity} disponíveis</span>`;
    return `<span>${quantity} disponíveis</span>`;
  }

  function renderProducts(filteredProducts) {
    productsCount.textContent = `${filteredProducts.length} ${filteredProducts.length === 1 ? 'item disponível' : 'itens disponíveis'}`;
    productGrid.innerHTML = filteredProducts.map((product) => `<article class="product-card"><div class="product-image">${product.imagemUrl ? `<img src="${escapeHtml(product.imagemUrl)}" alt="" />` : '<span aria-hidden="true">✿</span>'}</div><div class="product-card-body"><span class="product-category">${escapeHtml(product.categoria)}</span><h3>${escapeHtml(product.nome)}</h3><p class="product-sku">${escapeHtml(product.sku)}</p><div class="product-card-footer"><div><strong>${currency(product.precoVenda)}</strong>${stockLabel(product.quantidadeEstoque)}</div><button class="add-button" data-add="${product.id}" type="button" aria-label="Adicionar ${escapeHtml(product.nome)}">+</button></div></div></article>`).join('') || '<div class="empty-products">Nenhum produto disponível para seleção.</div>';
  }

  function reconcileCart() {
    cart = cart.map((item) => {
      const product = products.find((entry) => entry.id === item.id);
      if (!product || product.quantidadeEstoque <= 0) return null;
      return { ...product, quantity: Math.min(item.quantity, product.quantidadeEstoque) };
    }).filter(Boolean);
    persistCart();
  }

  function renderCart() {
    if (!cart.length) {
      cartItems.innerHTML = '<div class="empty-cart"><span aria-hidden="true">＋</span><strong>Seu carrinho está vazio</strong><p>Selecione um produto ao lado para começar.</p></div>';
    } else {
      cartItems.innerHTML = cart.map((item) => `<article class="cart-item"><div class="cart-item-info"><strong>${escapeHtml(item.nome)}</strong><span>${currency(item.precoVenda)} cada</span></div><div class="cart-item-actions"><div class="quantity-control"><button data-decrease="${item.id}" type="button" aria-label="Diminuir quantidade">−</button><strong>${item.quantity}</strong><button data-increase="${item.id}" type="button" aria-label="Aumentar quantidade" ${item.quantity >= item.quantidadeEstoque ? 'disabled' : ''}>+</button></div><strong class="item-subtotal">${currency(Number(item.precoVenda) * item.quantity)}</strong><button class="remove-button" data-remove="${item.id}" type="button" aria-label="Remover item">×</button></div></article>`).join('');
    }

    const subtotal = calculateSubtotal();
    discount = Math.min(Math.max(discount, 0), subtotal);
    discountInput.value = discount.toFixed(2);
    document.querySelector('#subtotal').textContent = currency(subtotal);
    document.querySelector('#discount-total').textContent = `- ${currency(discount)}`;
    document.querySelector('#grand-total').textContent = currency(subtotal - discount);
    continueButton.disabled = cart.length === 0;
    clearCartButton.disabled = cart.length === 0;
    document.querySelector('#checkout-total').textContent = currency(subtotal - discount);
    persistCart();
  }

  function updateCashFields() {
    const isCash = paymentMethod.value === 'DINHEIRO';
    cashFields.hidden = !isCash;
    if (!isCash) return;
    const received = Number(amountReceived.value) || 0;
    changeValue.textContent = currency(Math.max(received - (calculateSubtotal() - discount), 0));
  }

  function openCheckout() {
    if (!cart.length) return;
    checkoutFeedback.textContent = '';
    paymentMethod.value = 'DINHEIRO';
    amountReceived.value = '';
    updateCashFields();
    checkoutModal.hidden = false;
    paymentMethod.focus();
  }

  function closeCheckout() {
    checkoutModal.hidden = true;
  }

  function showFeedback(message, isError = false) {
    productFeedback.textContent = message;
    productFeedback.className = isError ? 'feedback is-error' : 'feedback';
    if (message) window.setTimeout(() => { productFeedback.textContent = ''; }, 2600);
  }

  function addToCart(id) {
    const product = products.find((entry) => entry.id === id);
    if (!product) return;
    const item = cart.find((entry) => entry.id === id);
    if (item && item.quantity >= product.quantidadeEstoque) {
      showFeedback(`Estoque máximo atingido para ${product.nome}.`, true);
      return;
    }
    if (item) item.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    renderCart();
  }

  function updateQuantity(id, amount) {
    const item = cart.find((entry) => entry.id === id);
    if (!item) return;
    const nextQuantity = item.quantity + amount;
    if (nextQuantity > item.quantidadeEstoque) {
      showFeedback(`Não há mais unidades disponíveis de ${item.nome}.`, true);
      return;
    }
    if (nextQuantity <= 0) cart = cart.filter((entry) => entry.id !== id);
    else item.quantity = nextQuantity;
    renderCart();
  }

  function filterProducts() {
    const term = document.querySelector('#quick-search').value.trim().toLowerCase();
    renderProducts(products.filter((product) => `${product.nome} ${product.sku}`.toLowerCase().includes(term)));
  }

  productGrid.addEventListener('click', (event) => { if (event.target.dataset.add) addToCart(event.target.dataset.add); });
  cartItems.addEventListener('click', (event) => {
    if (event.target.dataset.increase) updateQuantity(event.target.dataset.increase, 1);
    if (event.target.dataset.decrease) updateQuantity(event.target.dataset.decrease, -1);
    if (event.target.dataset.remove) { cart = cart.filter((item) => item.id !== event.target.dataset.remove); renderCart(); }
  });
  document.querySelector('#quick-search').addEventListener('input', filterProducts);
  discountInput.addEventListener('input', () => { discount = Number(discountInput.value) || 0; renderCart(); });
  clearCartButton.addEventListener('click', () => { cart = []; renderCart(); });
  continueButton.addEventListener('click', openCheckout);
  document.querySelector('#close-checkout').addEventListener('click', closeCheckout);
  checkoutModal.addEventListener('click', (event) => { if (event.target === checkoutModal) closeCheckout(); });
  paymentMethod.addEventListener('change', updateCashFields);
  amountReceived.addEventListener('input', updateCashFields);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeCheckout(); });

  checkoutForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const total = calculateSubtotal() - discount;
    const received = Number(amountReceived.value) || 0;
    if (paymentMethod.value === 'DINHEIRO' && received < total) {
      checkoutFeedback.textContent = `Valor recebido insuficiente. Faltam ${currency(total - received)}.`;
      checkoutFeedback.className = 'checkout-feedback is-error';
      return;
    }

    confirmSaleButton.disabled = true;
    confirmSaleButton.textContent = 'Processando...';
    checkoutFeedback.textContent = '';
    try {
      const pedido = await pedidosService.create({
        items: cart.map((item) => ({ produtoId: item.id, quantidade: item.quantity })),
        desconto: discount,
        formaPagamento: paymentMethod.value
      });
      cart = [];
      discount = 0;
      persistCart();
      closeCheckout();
      await initialize();
      showFeedback(`Venda finalizada com sucesso. Pedido ${pedido.id.slice(0, 8)}.`, false);
    } catch (error) {
      checkoutFeedback.textContent = error.message;
      checkoutFeedback.className = 'checkout-feedback is-error';
    } finally {
      confirmSaleButton.disabled = false;
      confirmSaleButton.textContent = 'Confirmar venda';
    }
  });

  async function initialize() {
    try {
      const result = await produtosService.list(1, 100, '', '');
      products = result.items.filter((product) => product.quantidadeEstoque > 0 && product.ativo);
      reconcileCart();
      renderProducts(products);
      renderCart();
    } catch (error) {
      productFeedback.textContent = error.message;
      productFeedback.classList.add('is-error');
    }
  }

  initialize();
})();
