import './styles.css';

const products = [
  { id: 1, name: 'Void Runner', category: 'Techwear', price: 289.9, tag: 'NEW DROP', tone: 'violet', code: '01', visual: 'jacket' },
  { id: 2, name: 'Neon Core', category: 'Essentials', price: 149.9, tag: 'BEST SELLER', tone: 'cyan', code: '02', visual: 'hoodie' },
  { id: 3, name: 'Rift 01', category: 'Footwear', price: 399.9, tag: 'LIMITED', tone: 'orange', code: '03', visual: 'shoe' },
  { id: 4, name: 'Signal Pack', category: 'Accessories', price: 119.9, tag: 'IN STOCK', tone: 'pink', code: '04', visual: 'bag' },
  { id: 5, name: 'Ghost Layer', category: 'Techwear', price: 239.9, tag: 'NEW DROP', tone: 'lime', code: '05', visual: 'jacket' },
  { id: 6, name: 'Pulse Tee', category: 'Essentials', price: 89.9, tag: 'IN STOCK', tone: 'blue', code: '06', visual: 'tee' },
  { id: 7, name: 'Arc Shell', category: 'Techwear', price: 329.9, tag: 'LIMITED', tone: 'purple', code: '07', visual: 'jacket' },
  { id: 8, name: 'Mono Utility', category: 'Accessories', price: 159.9, tag: 'NEW DROP', tone: 'yellow', code: '08', visual: 'bag' },
];

const categories = [
  { name: 'Techwear', count: '12 items', tone: 'violet', glyph: '✦' },
  { name: 'Essentials', count: '28 items', tone: 'cyan', glyph: '◒' },
  { name: 'Footwear', count: '09 items', tone: 'orange', glyph: '↗' },
  { name: 'Accessories', count: '16 items', tone: 'pink', glyph: '⌁' },
];

let cart = [];
let activeFilter = 'All';

const money = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const icon = (name, size = 20) => {
  const paths = {
    search: '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path>',
    bag: '<path d="M6 8h12l1 12H5L6 8Z"></path><path d="M9 8a3 3 0 0 1 6 0"></path>',
    arrow: '<path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path>',
    close: '<path d="m6 6 12 12M18 6 6 18"></path>',
    plus: '<path d="M12 5v14M5 12h14"></path>',
    minus: '<path d="M5 12h14"></path>',
    chevron: '<path d="m6 9 6 6 6-6"></path>',
    spark: '<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z"></path>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.spark}</svg>`;
};

const productVisual = (product, large = false) => `
  <div class="product-visual ${product.tone} ${large ? 'large' : ''} visual-${product.visual}">
    <div class="visual-noise"></div>
    <div class="visual-grid"></div>
    <span class="visual-code">ER / ${product.code}</span>
    <div class="visual-object"><span></span><i></i><b></b></div>
    <div class="visual-scan"></div>
    <strong>${product.code}</strong>
    <em>${product.category}</em>
  </div>`;

const productCard = (product, index) => `
  <article class="product-card reveal" data-category="${product.category}" data-id="${product.id}" style="--delay: ${index * 80}ms">
    <div class="card-image-wrap">
      <button class="wishlist" aria-label="Adicionar ${product.name} aos favoritos">♡</button>
      ${productVisual(product)}
      <span class="product-tag">${product.tag}</span>
      <button class="quick-add" data-add="${product.id}">${icon('plus', 15)} Adicionar</button>
    </div>
    <div class="product-meta">
      <div><span class="eyebrow">${product.category}</span><h3>${product.name}</h3></div>
      <strong>${money(product.price)}</strong>
    </div>
  </article>`;

const app = document.querySelector('#app');
app.innerHTML = `
  <div class="cursor-glow"></div>
  <div class="announcement"><span class="pulse-dot"></span><span>DROP 04.26</span><b>ENTRE NO FUTURO ANTES DE TODO MUNDO</b><button data-scroll="products">Explorar agora ${icon('arrow', 14)}</button></div>
  <header class="site-header">
    <a href="#top" class="brand" aria-label="E Rynex início"><span class="brand-mark">E<span></span></span><span class="brand-name">E RYNEX<small>THE NEXT DROP</small></span></a>
    <nav class="main-nav"><a class="active" href="#top">Início</a><a href="#categories">Universo</a><a href="#products">Drops</a><a href="#manifesto">Manifesto</a></nav>
    <div class="header-actions"><button class="header-search" data-focus-search>${icon('search', 18)}<span>Buscar <kbd>⌘ K</kbd></span></button><button class="icon-button cart-button" data-open-cart aria-label="Abrir carrinho">${icon('bag', 21)}<b class="cart-count">0</b></button><button class="menu-button" data-menu aria-label="Abrir menu">☰</button></div>
  </header>
  <main id="top">
    <section class="hero section-shell">
      <div class="hero-copy reveal">
        <span class="section-kicker"><i></i> A NEW FREQUENCY / 04.26</span>
        <h1>Não siga<br><span>o padrão.</span></h1>
        <p>Peças, objetos e sinais para quem escolhe existir um passo à frente. A E Rynex é um espaço de expressão em alta frequência.</p>
        <div class="hero-actions"><button class="button button-light" data-scroll="products">Ver os drops ${icon('arrow', 17)}</button><button class="text-link" data-scroll="manifesto">Ler manifesto <span>↗</span></button></div>
        <div class="hero-proof"><div class="avatar-stack"><span>ER</span><span>✦</span><span>04</span></div><p><strong>+2.4k</strong> pessoas já estão na frequência<br><small>★★★★☆ 4.9 / 5.0</small></p></div>
      </div>
      <div class="hero-art reveal" style="--delay: 180ms">
        <div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="orbit orbit-three"></div>
        <div class="hero-card"><div class="hero-card-top"><span>ER / 04.26</span><span>01 — 04</span></div><div class="hero-card-symbol">E<span>R</span></div><div class="hero-card-bottom"><span>FREQUENCY<br><b>SHIFTED</b></span><span>${icon('arrow', 20)}</span></div></div>
        <div class="floating-chip chip-one">${icon('spark', 13)} NO SIGNAL / NO LIMITS</div><div class="floating-chip chip-two">DROP<br><b>04.26</b></div>
      </div>
      <div class="hero-side-note"><span>SCROLL TO EXPLORE</span><i></i><b>↓</b></div>
    </section>

    <section class="ticker" aria-label="E Rynex frases"><div class="ticker-track"><span>MADE FOR THE UNCOMMON</span><b>✦</b><span>MOVE DIFFERENT</span><b>✦</b><span>BEYOND THE ORDINARY</span><b>✦</b><span>MADE FOR THE UNCOMMON</span><b>✦</b><span>MOVE DIFFERENT</span><b>✦</b><span>BEYOND THE ORDINARY</span><b>✦</b></div></section>

    <section class="categories section-shell" id="categories">
      <div class="section-heading reveal"><div><span class="section-kicker"><i></i> Explore the frequency</span><h2>Encontre o seu<br><em>próximo sinal.</em></h2></div><a class="arrow-link" href="#products">Ver tudo ${icon('arrow', 16)}</a></div>
      <div class="category-rail">${categories.map((cat, i) => `<button class="category-card reveal ${cat.tone}" data-filter="${cat.name}" style="--delay:${i * 90}ms"><span class="category-number">0${i + 1}</span><span class="category-glyph">${cat.glyph}</span><div><h3>${cat.name}</h3><p>${cat.count} <span>↗</span></p></div></button>`).join('')}</div>
    </section>

    <section class="products section-shell" id="products">
      <div class="section-heading products-heading reveal"><div><span class="section-kicker"><i></i> Curated signal</span><h2>Os mais <em>recentes.</em></h2></div><div class="filter-row"><button class="filter active" data-filter="All">Tudo</button>${categories.map(c => `<button class="filter" data-filter="${c.name}">${c.name}</button>`).join('')}</div></div>
      <div class="catalog-toolbar reveal"><p><strong id="result-count">08</strong> sinais encontrados</p><label class="search-field">${icon('search', 17)}<input id="search" type="search" placeholder="Buscar no catálogo..." /><span>/</span></label><button class="sort-button">Mais recentes ${icon('chevron', 15)}</button></div>
      <div class="products-grid" id="products-grid">${products.map(productCard).join('')}</div>
      <div class="empty-state" id="empty-state"><span>${icon('search', 28)}</span><h3>Nenhum sinal encontrado</h3><p>Tente outra busca ou explore uma categoria diferente.</p><button class="text-link" data-clear-search>Limpar filtros ↗</button></div>
    </section>

    <section class="manifesto section-shell" id="manifesto"><div class="manifesto-mark reveal">E<span>R</span></div><div class="manifesto-copy reveal" style="--delay:120ms"><span class="section-kicker"><i></i> The E Rynex manifesto</span><h2>O comum é um<br><em>ponto de partida.</em></h2><p>Não criamos coisas para preencher espaço. Criamos sinais para ocupar o seu. Cada drop é um convite a sair do ruído, quebrar o molde e fazer do seu jeito.</p><a class="button button-outline" href="#products">Conhecer a frequência ${icon('arrow', 16)}</a></div><div class="manifesto-index reveal" style="--delay:220ms"><span>04</span><i></i><span>26</span></div></section>

    <section class="newsletter section-shell reveal"><div><span class="section-kicker"><i></i> Stay in the loop</span><h2>Receba o sinal<br><em>antes de todo mundo.</em></h2></div><form id="newsletter"><input type="email" placeholder="seu@email.com" aria-label="Seu melhor e-mail" required /><button class="button button-light" type="submit">Entrar na lista ${icon('arrow', 15)}</button></form><p class="form-note" id="newsletter-note">Sem spam. Só drops e ideias que merecem espaço.</p></section>
  </main>
  <footer class="site-footer section-shell"><a href="#top" class="brand"><span class="brand-mark">E<span></span></span><span class="brand-name">E RYNEX<small>THE NEXT DROP</small></span></a><p>Para quem não nasceu para o óbvio.</p><div class="footer-links"><a href="#manifesto">Manifesto</a><a href="#products">Drops</a><a href="#top">Instagram ↗</a></div><span class="copyright">© 2026 E Rynex</span></footer>

  <div class="cart-overlay" data-close-cart></div><aside class="cart-drawer" aria-label="Carrinho de compras"><div class="drawer-head"><div><span class="eyebrow">YOUR FREQUENCY</span><h2>Seu carrinho <span class="cart-count-text">(0)</span></h2></div><button class="icon-button" data-close-cart aria-label="Fechar carrinho">${icon('close', 21)}</button></div><div class="cart-items" id="cart-items"></div><div class="cart-empty" id="cart-empty"><div class="empty-bag">${icon('bag', 30)}</div><h3>Seu carrinho está vazio.</h3><p>Adicione um drop para começar sua próxima frequência.</p><button class="button button-outline" data-close-cart>Explorar drops</button></div><div class="cart-summary" id="cart-summary"><div><span>Subtotal</span><strong id="cart-subtotal">R$ 0,00</strong></div><p>Frete calculado no checkout</p><button class="button button-light checkout-button" data-checkout>Ir para checkout ${icon('arrow', 16)}</button></div></aside>
  <div class="product-modal" id="product-modal"><div class="modal-backdrop" data-close-modal></div><div class="modal-content"><button class="modal-close icon-button" data-close-modal>${icon('close', 20)}</button><div id="modal-body"></div></div></div>
  <div class="toast" id="toast"><span>✦</span><p>Adicionado ao carrinho</p></div>
`;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  $$('.cart-count').forEach((el) => { el.textContent = count; el.classList.toggle('visible', count > 0); });
  $('.cart-count-text').textContent = `(${count})`;
  const items = $('#cart-items');
  $('#cart-empty').classList.toggle('hidden', cart.length > 0);
  $('#cart-summary').classList.toggle('visible', cart.length > 0);
  items.innerHTML = cart.map(item => `<div class="cart-item"><div class="cart-thumb">${productVisual(item.product)}</div><div class="cart-item-info"><span class="eyebrow">${item.product.category}</span><h3>${item.product.name}</h3><strong>${money(item.product.price)}</strong><div class="quantity"><button data-quantity="${item.product.id}" data-change="-1">${icon('minus', 13)}</button><span>${item.quantity}</span><button data-quantity="${item.product.id}" data-change="1">${icon('plus', 13)}</button></div></div><button class="remove-item" data-remove="${item.product.id}">${icon('close', 15)}</button></div>`).join('');
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  $('#cart-subtotal').textContent = money(subtotal);
}

function addToCart(id) {
  const product = products.find((item) => item.id === Number(id));
  const existing = cart.find((item) => item.product.id === product.id);
  if (existing) existing.quantity += 1; else cart.push({ product, quantity: 1 });
  renderCart();
  $('#toast').classList.add('show');
  setTimeout(() => $('#toast').classList.remove('show'), 2200);
}

function updateCatalog() {
  const query = $('#search').value.toLowerCase().trim();
  let visible = 0;
  $$('.product-card').forEach((card) => {
    const product = products.find((item) => item.id === Number(card.dataset.id));
    const matchesFilter = activeFilter === 'All' || product.category === activeFilter;
    const matchesSearch = !query || `${product.name} ${product.category}`.toLowerCase().includes(query);
    const match = matchesFilter && matchesSearch;
    card.classList.toggle('is-hidden', !match);
    if (match) visible += 1;
  });
  $('#result-count').textContent = String(visible).padStart(2, '0');
  $('#empty-state').classList.toggle('show', visible === 0);
}

function openCart() { document.body.classList.add('cart-open'); }
function closeCart() { document.body.classList.remove('cart-open'); }
function openModal(product) {
  $('#modal-body').innerHTML = `<div class="modal-grid"><div>${productVisual(product, true)}</div><div class="modal-info"><span class="section-kicker"><i></i> ${product.tag}</span><h2>${product.name}</h2><span class="modal-category">${product.category} / E Rynex Studio</span><p>Uma peça para sair do ruído. Design essencial, presença máxima e detalhes pensados para acompanhar o seu próximo movimento.</p><div class="modal-price">${money(product.price)} <small>ou 3x sem juros</small></div><div class="option-group"><span>Selecione o tamanho</span><div class="options"><button class="option active">P</button><button class="option">M</button><button class="option">G</button><button class="option">GG</button></div></div><button class="button button-light full" data-add-modal="${product.id}">Adicionar ao carrinho ${icon('arrow', 17)}</button><div class="modal-details"><span>⌁ Envio em até 48h</span><span>↻ Troca fácil em 30 dias</span><span>✦ Drop limitado E Rynex</span></div></div></div>`;
  $('#product-modal').classList.add('show');
}

$$('[data-scroll]').forEach(btn => btn.addEventListener('click', () => document.getElementById(btn.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' })));
$$('[data-open-cart]').forEach(btn => btn.addEventListener('click', openCart));
$$('[data-close-cart]').forEach(btn => btn.addEventListener('click', closeCart));
$$('[data-add]').forEach(btn => btn.addEventListener('click', (event) => { event.stopPropagation(); addToCart(btn.dataset.add); }));
$$('.product-card').forEach(card => card.addEventListener('click', (event) => { if (!event.target.closest('button')) openModal(products.find(p => p.id === Number(card.dataset.id))); }));
$$('.filter, .category-card').forEach(btn => btn.addEventListener('click', () => { activeFilter = btn.dataset.filter; $$('.filter').forEach(f => f.classList.toggle('active', f.dataset.filter === activeFilter)); updateCatalog(); document.getElementById('products').scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
$('#search').addEventListener('input', updateCatalog);
$('[data-focus-search]').addEventListener('click', () => { $('#search').focus(); document.getElementById('products').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
$$('[data-close-modal]').forEach(btn => btn.addEventListener('click', () => $('#product-modal').classList.remove('show')));
$('#product-modal').addEventListener('click', (e) => { if (e.target.closest('[data-add-modal]')) { addToCart(e.target.closest('[data-add-modal]').dataset.addModal); $('#product-modal').classList.remove('show'); openCart(); } if (e.target.classList.contains('option')) { $$('.option').forEach(o => o.classList.remove('active')); e.target.classList.add('active'); } });
$('#cart-items').addEventListener('click', (e) => { const quantityButton = e.target.closest('[data-quantity]'); const removeButton = e.target.closest('[data-remove]'); if (quantityButton) { const item = cart.find(i => i.product.id === Number(quantityButton.dataset.quantity)); item.quantity += Number(quantityButton.dataset.change); if (item.quantity <= 0) cart = cart.filter(i => i !== item); renderCart(); } if (removeButton) { cart = cart.filter(i => i.product.id !== Number(removeButton.dataset.remove)); renderCart(); } });
$('[data-clear-search]').addEventListener('click', () => { $('#search').value = ''; activeFilter = 'All'; $$('.filter').forEach(f => f.classList.toggle('active', f.dataset.filter === 'All')); updateCatalog(); });
$('#newsletter').addEventListener('submit', (e) => { e.preventDefault(); $('#newsletter-note').textContent = 'Sinal captado. Você será o primeiro a saber do próximo drop.'; $('#newsletter-note').classList.add('success'); e.target.reset(); });
$('[data-checkout]').addEventListener('click', () => { closeCart(); $('#toast').querySelector('p').textContent = 'Checkout demonstrativo em breve'; $('#toast').classList.add('show'); setTimeout(() => { $('#toast').classList.remove('show'); $('#toast').querySelector('p').textContent = 'Adicionado ao carrinho'; }, 2300); });
$('[data-menu]').addEventListener('click', () => { $('.main-nav').classList.toggle('menu-open'); });

document.addEventListener('keydown', (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); $('#search').focus(); document.getElementById('products').scrollIntoView({ behavior: 'smooth' }); } if (e.key === 'Escape') { closeCart(); $('#product-modal').classList.remove('show'); } });

document.addEventListener('mousemove', (e) => { document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`); document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`); });
const observer = new IntersectionObserver((entries) => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); } }), { threshold: 0.08 });
$$('.reveal').forEach(el => observer.observe(el));
renderCart();
