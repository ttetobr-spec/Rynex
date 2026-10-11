import './styles.css';

const API_BASE = window.__RYNEX_API_URL__ || import.meta.env.VITE_RYNEX_API_URL || '';
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const SESSION_KEY = 'rynex-session';
const getSession = () => { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; } };
const loadCatalog = async () => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 900);
  try {
    const response = await fetch(`${API_BASE}/api/store/catalog`, { signal: controller.signal, headers: { accept: 'application/json' } });
    if (!response.ok) return null;
    return await response.json();
  } catch (_) { return null; } finally { window.clearTimeout(timeout); }
};
const getCachedCatalog = () => { try { return JSON.parse(localStorage.getItem('rynex-catalog-cache') || 'null'); } catch { return null; } };
const remoteCatalog = getCachedCatalog();
loadCatalog().then(catalog => { if (catalog && JSON.stringify(catalog) !== JSON.stringify(remoteCatalog)) { localStorage.setItem('rynex-catalog-cache', JSON.stringify(catalog)); window.location.reload(); } });
const normaliseProduct = product => ({ id: String(product.id), name: String(product.name || 'Produto'), category: String(product.category || 'Geral'), price: Number(product.price || 0), imageUrl: /^https?:\/\//i.test(product.imageUrl || '') ? product.imageUrl : '', url: /^https?:\/\//i.test(product.url || '') ? product.url : '', description: String(product.description || ''), tag: String(product.tag || 'IN STOCK'), tone: String(product.tone || 'violet'), visual: String(product.visual || 'tee'), code: String(product.code || product.id), active: product.active !== false });

let products = [
  { id: 1, name: 'Void Runner', category: 'Techwear', price: 289.9, tag: 'NEW DROP', tone: 'violet', code: '01', visual: 'jacket', description: 'Uma camada utilitária para atravessar o ruído. Corte arquitetônico, presença silenciosa e detalhes que respondem ao seu movimento.' },
  { id: 2, name: 'Neon Core', category: 'Essentials', price: 149.9, tag: 'BEST SELLER', tone: 'cyan', code: '02', visual: 'hoodie', description: 'O essencial, mas nunca óbvio. Uma base confortável com a energia visual da próxima frequência.' },
  { id: 3, name: 'Rift 01', category: 'Footwear', price: 399.9, tag: 'LIMITED', tone: 'orange', code: '03', visual: 'shoe', description: 'Um tênis projetado para mudar de direção. Volume expressivo, sola responsiva e acabamento de edição limitada.' },
  { id: 4, name: 'Signal Pack', category: 'Accessories', price: 119.9, tag: 'IN STOCK', tone: 'pink', code: '04', visual: 'bag', description: 'Tudo o que você precisa, em uma frequência compacta. Compartimentos inteligentes e identidade forte.' },
  { id: 5, name: 'Ghost Layer', category: 'Techwear', price: 239.9, tag: 'NEW DROP', tone: 'lime', code: '05', visual: 'jacket', description: 'Leve, modular e pronto para a cidade. Ghost Layer foi pensado para camadas e possibilidades.' },
  { id: 6, name: 'Pulse Tee', category: 'Essentials', price: 89.9, tag: 'IN STOCK', tone: 'blue', code: '06', visual: 'tee', description: 'Uma camiseta limpa com um pulso próprio. O primeiro sinal de qualquer look.' },
  { id: 7, name: 'Arc Shell', category: 'Techwear', price: 329.9, tag: 'LIMITED', tone: 'purple', code: '07', visual: 'jacket', description: 'Proteção com geometria. Arc Shell entrega uma silhueta precisa para dias em alta velocidade.' },
  { id: 8, name: 'Mono Utility', category: 'Accessories', price: 159.9, tag: 'NEW DROP', tone: 'yellow', code: '08', visual: 'bag', description: 'Acessório essencial para quem carrega apenas o que importa — e faz isso com estilo.' },
];
let categories = [
  { name: 'Techwear', count: '12 items', tone: 'violet', glyph: '✦' },
  { name: 'Essentials', count: '28 items', tone: 'cyan', glyph: '◒' },
  { name: 'Footwear', count: '09 items', tone: 'orange', glyph: '↗' },
  { name: 'Accessories', count: '16 items', tone: 'pink', glyph: '⌁' },
];
if (remoteCatalog?.products?.length) products = remoteCatalog.products.map(normaliseProduct);
if (remoteCatalog?.categories?.length) categories = remoteCatalog.categories.map((name, index) => ({ name, count: `${products.filter(product => product.category === name).length} items`, tone: ['violet', 'cyan', 'orange', 'pink'][index % 4], glyph: ['✦', '◒', '↗', '⌁'][index % 4] }));
const storeSettings = remoteCatalog?.settings || {};
const heroWords = String(storeSettings.heroTitle || 'Vista seu próximo sinal.').trim().split(/\s+/);
const heroTitleMarkup = `${escapeHtml(heroWords.slice(0, -2).join(' '))}<br><strong>${escapeHtml(heroWords.slice(-2).join(' '))}</strong>`;
const money = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const siteBase = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
const route = (path) => `${siteBase}${path === '/' ? '/' : path}`;
const asset = (path) => `${siteBase}${path}`;
const icon = (name, size = 20) => {
  const paths = { search: '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path>', bag: '<path d="M6 8h12l1 12H5L6 8Z"></path><path d="M9 8a3 3 0 0 1 6 0"></path>', arrow: '<path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path>', close: '<path d="m6 6 12 12M18 6 6 18"></path>', plus: '<path d="M12 5v14M5 12h14"></path>', minus: '<path d="M5 12h14"></path>', chevron: '<path d="m6 9 6 6 6-6"></path>', spark: '<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z"></path>', headphones: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"></path><path d="M4 14h3v5H5a1 1 0 0 1-1-1v-4Zm16 0h-3v5h2a1 1 0 0 0 1-1v-4Z"></path>', user: '<circle cx="12" cy="8" r="3"></circle><path d="M5 20a7 7 0 0 1 14 0"></path>' };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.spark}</svg>`;
};
const getCart = () => JSON.parse(localStorage.getItem('erynex-cart') || '[]').map(item => ({ product: products.find(p => String(p.id) === String(item.id)), quantity: item.quantity })).filter(item => item.product);
let cart = getCart();
const saveCart = () => localStorage.setItem('erynex-cart', JSON.stringify(cart.map(item => ({ id: item.product.id, quantity: item.quantity }))));
const cartCount = () => cart.reduce((total, item) => total + item.quantity, 0);
const rawPath = window.location.pathname;
const currentPath = (siteBase && rawPath.startsWith(siteBase) ? rawPath.slice(siteBase.length) : rawPath).replace(/\/$/, '') || '/';
const currentProduct = products.find(product => currentPath === `/product/${product.id}`) || products[0];

const productVisual = (product, large = false) => `<div class="product-visual ${product.tone} ${large ? 'large' : ''} visual-${product.visual || 'tee'}">${product.imageUrl ? `<img class="product-image" src="${product.imageUrl}" alt="${product.name}" loading="lazy" />` : ''}<div class="visual-noise"></div><div class="visual-grid"></div><span class="visual-code">ER / ${product.code}</span>${product.imageUrl ? '' : `<div class="visual-object"><span></span><i></i><b></b></div>`}<div class="visual-scan"></div><strong>${product.code}</strong><em>${product.category}</em></div>`;
const productCard = (product, index = 0) => { const href = product.url || route(`/product/${product.id}`); return `<article class="product-card reveal" data-category="${product.category}" data-id="${product.id}" style="--delay:${index * 60}ms"><a href="${href}" class="card-image-wrap"><button class="wishlist" type="button" aria-label="Favoritar">♡</button>${productVisual(product)}<span class="product-tag">${product.tag}</span><button class="quick-add" type="button" data-add="${product.id}">${icon('plus', 15)}<span>Adicionar</span></button></a><div class="product-meta"><div><span class="eyebrow">${product.category}</span><h3><a href="${href}">${product.name}</a></h3></div><strong>${money(product.price)}</strong></div></article>`; };
const logo = `<img class="brand-logo" src="${asset('/erynex-logo.png')}" alt="E Rynex logo" />`;
const header = (active = '') => `<div class="announcement"><span class="pulse-dot"></span><span>DROP 04.26</span><b>ENTRE NO FUTURO ANTES DE TODO MUNDO</b><a href="${route('/shop')}">Explorar agora ${icon('arrow', 14)}</a></div><header class="site-header reference-header"><a href="${route('/')}" class="brand" aria-label="E Rynex início">${logo}<span class="brand-name">E ${escapeHtml(storeSettings.brandName || 'Rynex').toUpperCase()}<small>THE NEXT DROP</small></span></a><nav class="main-nav"><a class="${active === 'home' ? 'active' : ''}" href="${route('/')}">Início</a><a class="${active === 'shop' ? 'active' : ''}" href="${route('/shop')}">Drops</a><a class="${active === 'about' ? 'active' : ''}" href="${route('/about')}">Manifesto</a><a href="${route('/contact')}">Contato</a></nav><div class="header-actions"><button class="header-search" data-focus-search>${icon('search', 19)}<span>Pesquisar produto</span></button><button class="support-button" aria-label="Suporte">${icon('headphones', 22)}</button><a class="cart-button reference-cart" href="${route('/cart')}">${icon('bag', 20)}<span>Carrinho</span><b class="cart-count ${cartCount() ? 'visible' : ''}">${cartCount()}</b></a><a class="login-button" href="${route('/login')}">Entrar</a><button class="menu-button" data-menu aria-label="Abrir menu">☰</button></div></header>`;
const footer = `<footer class="site-footer section-shell"><a href="${route('/')}" class="brand">${logo}<span class="brand-name">E ${escapeHtml(storeSettings.brandName || 'Rynex').toUpperCase()}<small>THE NEXT DROP</small></span></a><p>Para quem não nasceu para o óbvio.</p><div class="footer-links"><a href="${route('/about')}">Manifesto</a><a href="${route('/shop')}">Drops</a><a href="${route('/contact')}">Contato</a><a href="#">Instagram ↗</a></div><span class="copyright">© 2026 E Rynex</span></footer>`;
const cartDrawer = `<div class="cart-overlay" data-close-cart></div><aside class="cart-drawer" aria-label="Carrinho de compras"><div class="drawer-head"><div><span class="eyebrow">YOUR FREQUENCY</span><h2>Seu carrinho <span class="cart-count-text">(${cartCount()})</span></h2></div><button class="icon-button" data-close-cart>${icon('close', 21)}</button></div><div class="cart-items" id="cart-items"></div><div class="cart-empty ${cart.length ? 'hidden' : ''}" id="cart-empty"><div class="empty-bag">${icon('bag', 30)}</div><h3>Seu carrinho está vazio.</h3><p>Adicione um drop para começar sua próxima frequência.</p><a class="button button-outline" href="${route('/shop')}">Explorar drops</a></div><div class="cart-summary ${cart.length ? 'visible' : ''}" id="cart-summary"><div><span>Subtotal</span><strong id="cart-subtotal">${money(cart.reduce((total, item) => total + item.product.price * item.quantity, 0))}</strong></div><p>Frete calculado no checkout</p><button class="button button-light checkout-button" data-checkout>Ir para checkout ${icon('arrow', 16)}</button></div></aside>`;
const pageShell = (content, active) => `<div class="cursor-glow"></div>${header(active)}<main>${content}</main>${footer}${cartDrawer}<div class="toast" id="toast"><span>✦</span><p>Adicionado ao carrinho</p></div>`;

function loginPage() {
  const session = getSession();
  return `<section class="page-hero auth-hero section-shell"><span class="section-kicker"><i></i> Rynex account</span><h1>Entre no<br><span>seu canal.</span></h1><p>Use seu e-mail para acompanhar pedidos, conversar com a equipe e receber sua entrega manual.</p></section><section class="auth-section section-shell"><div class="auth-card"><span class="section-kicker"><i></i> Acesso seguro</span><h2>${session ? `Você está conectado, ${session.user?.name || 'cliente'}.` : 'Entrar na conta'}</h2>${session ? `<p class="auth-note success">Sua conta está pronta para o checkout.</p><a class="button button-light full" href="${route('/cart')}">Voltar ao carrinho ${icon('arrow', 16)}</a>` : `<form id="login-form"><label>E-mail<input name="email" type="email" placeholder="seu@gmail.com" required /></label><label>Senha<input name="password" type="password" minlength="8" required /></label><button class="button button-light full" type="submit">Entrar ${icon('arrow', 16)}</button><p id="login-note" class="auth-note">A senha é validada pelo servidor e não fica no navegador.</p></form><div class="auth-divider"><span>ou crie sua conta</span></div><form id="register-form"><label>Nome<input name="name" placeholder="Como podemos chamar você?" required /></label><label>Nome de usuário<input name="username" placeholder="rynex-user" required /></label><label>Gmail / e-mail<input name="email" type="email" placeholder="seu@gmail.com" required /></label><label>Senha<input name="password" type="password" minlength="8" required /></label><button class="button button-outline full" type="submit">Criar conta ${icon('arrow', 16)}</button><p id="register-note" class="auth-note">Use uma senha com pelo menos 8 caracteres.</p></form>`}</div><div class="auth-aside"><span class="section-kicker"><i></i> Seu pedido, sem ruído</span><h2>Do pagamento<br><em>à entrega.</em></h2><p>O pedido fica registrado, a equipe recebe um canal privado no Discord e a conversa aparece no site e no atendimento.</p></div></section>`;
}

function homePage() {
  const featured = products.slice(0, 3);
  return `<div class="reference-home"><section class="reference-hero section-shell"><div class="hero-backdrop">${productVisual(featured[1], true)}</div><div class="hero-carousel"><button class="hero-arrow hero-prev" type="button" aria-label="Slide anterior" data-hero-prev>‹</button><div class="hero-slides"><article class="hero-slide is-active" data-hero-slide="0"><div class="slide-copy"><span class="slide-kicker">✦ DROP 04.26 / E RYNEX</span><h1>${heroTitleMarkup}</h1><p>Peças para quem não segue o ruído. A nova coleção E Rynex já está no ar.</p><div class="slide-actions"><a class="button button-light" href="${route('/shop')}">Explorar coleção ${icon('arrow', 16)}</a><span class="slide-meta">01 <i></i> 03</span></div></div><div class="slide-art">${productVisual(featured[0], true)}<span class="slide-art-label">${featured[0].name} / ${money(featured[0].price)}</span></div></article><article class="hero-slide" data-hero-slide="1"><div class="slide-copy"><span class="slide-kicker">✦ BEST SELLER / E RYNEX</span><h1>O essencial<br><strong>com presença.</strong></h1><p>Formas limpas, função real e uma energia que não pede permissão.</p><div class="slide-actions"><a class="button button-light" href="${route('/product/2')}">Ver Neon Core ${icon('arrow', 16)}</a><span class="slide-meta">02 <i></i> 03</span></div></div><div class="slide-art">${productVisual(featured[1], true)}<span class="slide-art-label">${featured[1].name} / ${money(featured[1].price)}</span></div></article><article class="hero-slide" data-hero-slide="2"><div class="slide-copy"><span class="slide-kicker">✦ LIMITED SIGNAL / 01 OF 08</span><h1>Feito para<br><strong>mover diferente.</strong></h1><p>Um drop limitado para transformar cada chegada em uma declaração.</p><div class="slide-actions"><a class="button button-light" href="${route('/product/3')}">Descobrir RIFT 01 ${icon('arrow', 16)}</a><span class="slide-meta">03 <i></i> 03</span></div></div><div class="slide-art">${productVisual(featured[2], true)}<span class="slide-art-label">${featured[2].name} / ${money(featured[2].price)}</span></div></article></div><button class="hero-arrow hero-next" type="button" aria-label="Próximo slide" data-hero-next>›</button><div class="hero-dots"><button class="is-active" data-hero-dot="0" aria-label="Slide 1"></button><button data-hero-dot="1" aria-label="Slide 2"></button><button data-hero-dot="2" aria-label="Slide 3"></button></div></div></section><section class="reference-section best-sellers section-shell"><div class="reference-section-head"><div><span class="section-kicker"><i></i> Curadoria E Rynex</span><h2><span>★</span> Mais vendidos</h2></div><a href="${route('/shop')}" class="reference-link">Ver todos ${icon('arrow', 15)}</a></div><div class="reference-product-grid">${products.slice(0, 4).map(productCard).join('')}</div></section><section class="reference-promo section-shell"><div><span class="section-kicker"><i></i> The E Rynex signal</span><h2>Não é tendência.<br><strong>É direção.</strong></h2><p>Descubra objetos e peças criados para quem transforma diferença em linguagem.</p><a class="button button-light" href="${route('/about')}">Conhecer a marca ${icon('arrow', 16)}</a></div><div class="promo-symbol"><img src="${asset('/erynex-symbol.png')}" alt="Símbolo E Rynex" /></div></section><section class="newsletter section-shell reveal"><div><span class="section-kicker"><i></i> Stay in the loop</span><h2>Receba o sinal<br><em>antes de todo mundo.</em></h2></div><form id="newsletter"><input type="email" placeholder="seu@email.com" required /><button class="button button-light">Entrar na lista ${icon('arrow', 15)}</button></form><p class="form-note" id="newsletter-note">Sem spam. Só drops e ideias que merecem espaço.</p></section></div>`;
}
function shopPage() {
  return `<section class="page-hero section-shell"><span class="section-kicker"><i></i> The E Rynex catalog / 04.26</span><h1>Todos os<br><span>sinais.</span></h1><p>Explore a coleção completa. Cada peça nasce para sair do ruído e entrar no seu ritmo.</p></section><section class="shop-section section-shell"><div class="catalog-toolbar"><p><strong id="result-count">${String(products.length).padStart(2, '0')}</strong> sinais encontrados</p><label class="search-field">${icon('search', 17)}<input id="search" type="search" placeholder="Buscar no catálogo..." /><span>/</span></label><button class="sort-button">Mais recentes ${icon('chevron', 15)}</button></div><div class="shop-layout"><aside class="shop-filters"><span class="eyebrow">Filtrar por frequência</span><button class="filter active" data-filter="All">Tudo <b>${String(products.length).padStart(2, '0')}</b></button>${categories.map(cat => `<button class="filter" data-filter="${cat.name}">${cat.name} <b>${cat.count.split(' ')[0]}</b></button>`).join('')}<div class="filter-note">DROP 04.26<br><span>O próximo sinal já está aqui.</span></div></aside><div><div class="products-grid" id="products-grid">${products.map(productCard).join('')}</div><div class="empty-state" id="empty-state"><span>${icon('search', 28)}</span><h3>Nenhum sinal encontrado</h3><p>Tente outra busca ou explore uma categoria diferente.</p><button class="text-link" data-clear-search>Limpar filtros ↗</button></div></div></div></section>`;
}
function aboutPage() {
  return `<section class="page-hero about-hero section-shell"><span class="section-kicker"><i></i> E Rynex studio / 2026</span><h1>Feito para<br><span>o incomum.</span></h1><p>Somos um estúdio independente de objetos, roupas e ideias para quem transforma diferença em direção.</p></section><section class="about-intro section-shell"><div class="manifesto-mark"><img src="${asset('/erynex-symbol.png')}" alt="Logo E Rynex" /></div><div><span class="section-kicker"><i></i> Our frequency</span><h2>Não é sobre<br><em>seguir tendência.</em></h2><p>E Rynex nasceu do encontro entre forma, movimento e tecnologia. A gente acredita que o estilo não precisa pedir licença — ele só precisa dizer algo verdadeiro sobre quem usa.</p><p>Cada drop é limitado, pensado em detalhes e criado para viver fora da lógica do descartável. Menos ruído. Mais presença.</p></div></section><section class="timeline-section section-shell"><span class="section-kicker"><i></i> How we move</span><div class="timeline"><div><span>01</span><h3>Observar</h3><p>Encontrar beleza onde o algoritmo ainda não chegou.</p></div><div><span>02</span><h3>Construir</h3><p>Transformar uma ideia em matéria, função e sensação.</p></div><div><span>03</span><h3>Emitir</h3><p>Colocar algo novo no mundo e deixar que ele encontre você.</p></div></div></section><section class="about-quote section-shell"><p>“O comum é um ponto de partida.”</p><span>— E Rynex / signal 001</span></section>`;
}
function productPage(product) {
  const related = products.filter(item => item.id !== product.id && item.category === product.category).slice(0, 3);
  return `<section class="breadcrumb section-shell"><a href="${route('/shop')}">Drops</a><span>/</span><span>${product.name}</span></section><section class="product-detail section-shell"><div class="detail-visual">${productVisual(product, true)}<span class="detail-stamp">ER / ${product.code}<br>LIMITED SIGNAL</span></div><div class="detail-copy"><span class="section-kicker"><i></i> ${product.tag}</span><h1>${product.name}</h1><span class="modal-category">${product.category} / E Rynex Studio</span><p>${product.description}</p><div class="detail-price">${money(product.price)} <small>ou 3x sem juros</small></div><div class="option-group"><span>Selecione o tamanho</span><div class="options"><button class="option active">P</button><button class="option">M</button><button class="option">G</button><button class="option">GG</button></div></div><button class="button button-light full" data-add="${product.id}">Adicionar ao carrinho ${icon('arrow', 17)}</button><div class="modal-details"><span>⌁ Envio em até 48h</span><span>↻ Troca fácil em 30 dias</span><span>✦ Drop limitado E Rynex</span></div></div></section><section class="product-info section-shell"><div><span class="eyebrow">01 / Design</span><h2>Construído para<br><em>mover com você.</em></h2></div><p>Textura, volume e função encontram um equilíbrio preciso nesta peça. É um sinal para usar do seu jeito, em qualquer frequência.</p></section><section class="products related section-shell"><div class="section-heading"><div><span class="section-kicker"><i></i> You may also like</span><h2>Mais da <em>frequência.</em></h2></div><a class="arrow-link" href="${route('/shop')}">Ver catálogo ${icon('arrow', 16)}</a></div><div class="products-grid">${related.map(productCard).join('')}</div></section>`;
}
const getLastOrder = () => { try { return JSON.parse(localStorage.getItem('rynex-last-order') || 'null'); } catch { return null; } };
function orderChatPanel(order) {
  let payment = null;
  try { payment = JSON.parse(localStorage.getItem(`rynex-payment-${order.id}`) || 'null'); } catch {}
  const status = order.status === 'awaiting_delivery' || order.status === 'paid' ? 'Pagamento confirmado / aguardando entrega' : order.status === 'payment_rejected' ? 'Pagamento recusado' : 'Aguardando pagamento';
  return `<section class="order-chat-section"><div class="order-chat-card" id="order-chat-card" data-order-id="${order.id}"><div class="section-kicker"><i></i> Atendimento do pedido</div><div class="order-chat-head"><div><h2>Pedido ${order.id}</h2><p>Converse por aqui; as mensagens também chegam ao canal privado no Discord.</p></div><span class="order-status" id="order-status">${status}</span></div><div class="order-summary"><span>${(order.items || []).map(item => `${item.quantity}× ${item.name}`).join(' · ')}</span><strong>${money(order.total || 0)}</strong></div>${Number(order.total) > 0 ? `<div class="order-payment"><strong>Pagamento manual por Pix</strong>${payment?.pixKey ? `Chave Pix: <code>${payment.pixKey}</code><br>` : 'A chave Pix ainda não foi configurada pela equipe.<br>'}${payment?.instructions || 'Depois do Pix, envie o comprovante no atendimento para confirmação manual.'}</div>` : ''}<div class="order-messages" id="order-messages" aria-live="polite"><p class="order-note">Carregando conversa…</p></div><form class="order-message-form" id="order-message-form"><label for="order-message-input">Sua mensagem</label><textarea id="order-message-input" name="content" maxlength="1800" placeholder="Escreva para a equipe…" required></textarea><button class="button button-light" type="submit">Enviar mensagem ${icon('arrow', 16)}</button><p class="order-note" id="order-message-note">A equipe responde pelo Discord; a resposta aparece aqui automaticamente.</p></form></div></section>`;
}
function cartPage() {
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const session = getSession();
  const lastOrder = getLastOrder();
  return `<section class="page-hero cart-page-hero section-shell"><span class="section-kicker"><i></i> Your frequency</span><h1>Seu<br><span>carrinho.</span></h1><p>Revise seus sinais antes de seguir para o checkout.</p></section><section class="cart-page section-shell"><div id="cart-page-items">${cart.length ? cart.map(cartItem).join('') : lastOrder ? '' : `<div class="cart-page-empty"><div class="empty-bag">${icon('bag', 35)}</div><h2>Seu carrinho está vazio.</h2><p>A próxima frequência começa no catálogo.</p><a class="button button-light" href="${route('/shop')}">Explorar drops ${icon('arrow', 16)}</a></div>`}</div>${cart.length ? `<aside class="cart-page-summary"><span class="eyebrow">Order summary</span><h2>Resumo do pedido</h2><div><span>Subtotal</span><strong>${money(subtotal)}</strong></div><div><span>Frete</span><strong class="free">A combinar</strong></div><hr><div><span>Total estimado</span><strong>${money(subtotal)}</strong></div>${session ? `<form id="checkout-form" class="checkout-form"><label>E-mail de contato<input name="email" type="email" value="${session.user?.email || ''}" required /></label><label>ID do Discord <small>opcional, para liberar o canal ao cliente</small><input name="discordUserId" inputmode="numeric" placeholder="Ex.: 123456789012345678" /></label><label>Cupom<input name="coupon" placeholder="RYNEX-TEST" /></label><button class="button button-light full" type="submit">Criar pedido ${icon('arrow', 16)}</button><p id="checkout-note">${escapeHtml(storeSettings.checkoutNote || 'Pagamento manual via Pix; a entrega é feita pela equipe no atendimento.')}</p></form>` : `<a class="button button-light full" href="${route('/login?return=/cart')}">Entrar para finalizar ${icon('arrow', 16)}</a><p>Você precisa criar uma conta para acompanhar o pedido.</p>`}</aside>` : ''}${lastOrder ? orderChatPanel(lastOrder) : ''}</section>`;
}
const cartItem = item => `<div class="cart-page-item"><div class="cart-thumb">${productVisual(item.product)}</div><div><span class="eyebrow">${item.product.category}</span><h3>${item.product.name}</h3><strong>${money(item.product.price)}</strong><div class="quantity"><button data-quantity="${item.product.id}" data-change="-1">${icon('minus', 13)}</button><span>${item.quantity}</span><button data-quantity="${item.product.id}" data-change="1">${icon('plus', 13)}</button></div></div><button class="remove-item" data-remove="${item.product.id}">${icon('close', 16)}</button></div>`;

let content = currentPath === '/' ? homePage() : currentPath === '/shop' ? shopPage() : currentPath === '/about' ? aboutPage() : currentPath === '/cart' ? cartPage() : currentPath === '/login' ? loginPage() : currentPath === '/contact' ? `<section class="page-hero section-shell"><span class="section-kicker"><i></i> Open channel</span><h1>Fale com<br><span>a gente.</span></h1><p>Para colaborações, dúvidas ou só para mandar um sinal, escreva para nós.</p></section><section class="contact-section section-shell"><form id="contact-form"><label>Seu nome<input required placeholder="Como podemos chamar você?" /></label><label>Seu e-mail<input required type="email" placeholder="seu@email.com" /></label><label>Mensagem<textarea required placeholder="Escreva seu sinal..."></textarea></label><button class="button button-light">Enviar mensagem ${icon('arrow', 16)}</button><p id="contact-note">Respondemos em até 48 horas.</p></form><div class="contact-aside"><span class="section-kicker"><i></i> E Rynex studio</span><h2>Sem ruído.<br><em>Direto ao ponto.</em></h2><p>São Paulo / Brasil<br>${escapeHtml(storeSettings.supportEmail || 'hello@erynex.com')}<br>@erynex.studio</p></div></section>` : currentPath.startsWith('/product/') ? productPage(currentProduct) : shopPage();
const active = currentPath === '/' ? 'home' : currentPath === '/about' ? 'about' : currentPath === '/login' ? '' : 'shop';
document.querySelector('#app').innerHTML = pageShell(content, active);
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function renderCartDrawer() {
  const count = cartCount();
  $$('.cart-count').forEach(el => { el.textContent = count; el.classList.toggle('visible', count > 0); });
  const text = $('.cart-count-text'); if (text) text.textContent = `(${count})`;
  const items = $('#cart-items'); if (!items) return;
  $('#cart-empty').classList.toggle('hidden', cart.length > 0); $('#cart-summary').classList.toggle('visible', cart.length > 0);
  items.innerHTML = cart.map(item => `<div class="cart-item"><div class="cart-thumb">${productVisual(item.product)}</div><div class="cart-item-info"><span class="eyebrow">${item.product.category}</span><h3>${item.product.name}</h3><strong>${money(item.product.price)}</strong><div class="quantity"><button data-quantity="${item.product.id}" data-change="-1">${icon('minus', 13)}</button><span>${item.quantity}</span><button data-quantity="${item.product.id}" data-change="1">${icon('plus', 13)}</button></div></div><button class="remove-item" data-remove="${item.product.id}">${icon('close', 15)}</button></div>`).join('');
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0); const subtotalNode = $('#cart-subtotal'); if (subtotalNode) subtotalNode.textContent = money(subtotal);
}
function addToCart(id) { const product = products.find(item => String(item.id) === String(id)); if (!product) return; const existing = cart.find(item => item.product.id === product.id); existing ? existing.quantity += 1 : cart.push({ product, quantity: 1 }); saveCart(); renderCartDrawer(); const toast = $('#toast'); if (toast) { toast.querySelector('p').textContent = 'Adicionado ao carrinho'; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2200); } }
function changeCart(id, delta) { const item = cart.find(entry => String(entry.product.id) === String(id)); if (!item) return; item.quantity += delta; if (item.quantity <= 0) cart = cart.filter(entry => entry !== item); saveCart(); renderCartDrawer(); if (currentPath === '/cart') window.location.reload(); }
function filterCatalog(filter) { $$('.filter').forEach(btn => btn.classList.toggle('active', btn.dataset.filter === filter)); const query = ($('#search')?.value || '').toLowerCase().trim(); let visible = 0; $$('.product-card').forEach(card => { const product = products.find(item => String(item.id) === String(card.dataset.id)); const match = (filter === 'All' || product.category === filter) && (!query || `${product.name} ${product.category}`.toLowerCase().includes(query)); card.classList.toggle('is-hidden', !match); if (match) visible += 1; }); if ($('#result-count')) $('#result-count').textContent = String(visible).padStart(2, '0'); if ($('#empty-state')) $('#empty-state').classList.toggle('show', visible === 0); }

renderCartDrawer();
$$('.reveal').forEach(el => new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in-view'); }), { threshold: .05 }).observe(el));
const heroSlides = $$('.hero-slide');
const heroDots = $$('[data-hero-dot]');
let heroIndex = 0;
const setHeroSlide = (index) => {
  if (!heroSlides.length) return;
  heroIndex = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, i) => slide.classList.toggle('is-active', i === heroIndex));
  heroDots.forEach((dot, i) => dot.classList.toggle('is-active', i === heroIndex));
};
$$('[data-hero-prev]').forEach(button => button.addEventListener('click', () => setHeroSlide(heroIndex - 1)));
$$('[data-hero-next]').forEach(button => button.addEventListener('click', () => setHeroSlide(heroIndex + 1)));
heroDots.forEach(dot => dot.addEventListener('click', () => setHeroSlide(Number(dot.dataset.heroDot))));
if (heroSlides.length) window.setInterval(() => setHeroSlide(heroIndex + 1), 6500);
document.addEventListener('click', event => {
  const add = event.target.closest('[data-add]'); if (add) { event.preventDefault(); event.stopPropagation(); addToCart(add.dataset.add); return; }
  const qty = event.target.closest('[data-quantity]'); if (qty) { changeCart(qty.dataset.quantity, Number(qty.dataset.change)); return; }
  const remove = event.target.closest('[data-remove]'); if (remove) { cart = cart.filter(item => String(item.product.id) !== String(remove.dataset.remove)); saveCart(); renderCartDrawer(); if (currentPath === '/cart') window.location.reload(); return; }
  if (event.target.closest('[data-open-cart]')) document.body.classList.add('cart-open');
  if (event.target.closest('[data-close-cart]')) document.body.classList.remove('cart-open');
  if (event.target.closest('[data-menu]')) $('.main-nav').classList.toggle('menu-open');
  const filter = event.target.closest('[data-filter]'); if (filter) { filterCatalog(filter.dataset.filter); }
  if (event.target.closest('[data-clear-search]')) { if ($('#search')) $('#search').value = ''; filterCatalog('All'); }
  if (event.target.closest('[data-checkout]')) { const toast = $('#toast'); toast.querySelector('p').textContent = 'Checkout demonstrativo em breve'; toast.classList.add('show'); setTimeout(() => { toast.classList.remove('show'); toast.querySelector('p').textContent = 'Adicionado ao carrinho'; }, 2300); }
  const option = event.target.closest('.option'); if (option) { $$('.option').forEach(item => item.classList.remove('active')); option.classList.add('active'); }
});
$('#search')?.addEventListener('input', () => filterCatalog($('.filter.active')?.dataset.filter || 'All'));
const apiRequest = async (path, options = {}) => {
  const session = getSession();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (session?.token) headers.Authorization = `Bearer ${session.token}`;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Não foi possível concluir a operação.');
  return payload;
};
const showAuthNote = (id, message, success = false) => { const node = document.querySelector(id); if (node) { node.textContent = message; node.classList.toggle('success', success); } };
$('#login-form')?.addEventListener('submit', async event => {
  event.preventDefault();
  const form = new FormData(event.target);
  showAuthNote('#login-note', 'Conectando...');
  try { const result = await apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: form.get('email'), password: form.get('password') }) }); localStorage.setItem(SESSION_KEY, JSON.stringify(result)); const next = new URLSearchParams(window.location.search).get('return') || '/cart'; window.location.href = route(next); }
  catch (error) { showAuthNote('#login-note', error.message); }
});
$('#register-form')?.addEventListener('submit', async event => {
  event.preventDefault();
  const form = new FormData(event.target);
  showAuthNote('#register-note', 'Criando sua conta...');
  try { const result = await apiRequest('/api/auth/register', { method: 'POST', body: JSON.stringify({ name: form.get('name'), username: form.get('username'), email: form.get('email'), password: form.get('password') }) }); localStorage.setItem(SESSION_KEY, JSON.stringify(result)); window.location.href = route('/cart'); }
  catch (error) { showAuthNote('#register-note', error.message); }
});
$('#checkout-form')?.addEventListener('submit', async event => {
  event.preventDefault();
  const form = new FormData(event.target);
  const note = document.querySelector('#checkout-note');
  if (note) note.textContent = 'Criando seu pedido...';
  try {
    const result = await apiRequest('/api/store/orders', { method: 'POST', body: JSON.stringify({ items: cart.map(item => ({ id: item.product.id, name: item.product.name, price: item.product.price, quantity: item.quantity })), coupon: form.get('coupon'), discordUserId: form.get('discordUserId') }) });
    localStorage.setItem('rynex-last-order', JSON.stringify(result.order));
    if (result.payment) localStorage.setItem(`rynex-payment-${result.order.id}`, JSON.stringify(result.payment));
    cart = []; saveCart();
    window.location.reload();
  } catch (error) { if (note) note.textContent = error.message; }
});
const refreshOrderChat = async () => {
  const card = $('#order-chat-card');
  if (!card) return;
  const orderId = card.dataset.orderId;
  try {
    const [chat, detail] = await Promise.all([
      apiRequest(`/api/store/orders/${encodeURIComponent(orderId)}/messages`),
      apiRequest(`/api/store/orders/${encodeURIComponent(orderId)}`),
    ]);
    const statusNode = $('#order-status');
    const status = detail.order?.status;
    if (statusNode) statusNode.textContent = status === 'awaiting_delivery' || status === 'paid' ? 'Pagamento confirmado / aguardando entrega' : status === 'payment_rejected' ? 'Pagamento recusado' : 'Aguardando pagamento';
    const list = $('#order-messages');
    if (!list) return;
    list.replaceChildren();
    for (const message of chat.messages || []) {
      const article = document.createElement('article');
      article.className = `order-message ${message.source === 'site' ? 'site' : 'discord'}`;
      const author = document.createElement('strong');
      author.textContent = `${message.authorName || 'Equipe'} · ${message.source === 'site' ? 'site' : 'Discord'}`;
      const body = document.createElement('p');
      body.textContent = message.content || '';
      const time = document.createElement('time');
      time.dateTime = message.at || '';
      time.textContent = message.at ? new Date(message.at).toLocaleString('pt-BR') : '';
      article.append(author, body, time);
      list.append(article);
    }
    if (!chat.messages?.length) {
      const empty = document.createElement('p');
      empty.className = 'order-note';
      empty.textContent = 'Ainda não há mensagens. Escreva para iniciar o atendimento.';
      list.append(empty);
    }
  } catch (error) {
    const note = $('#order-message-note');
    if (note) note.textContent = error.message;
  }
};
$('#order-message-form')?.addEventListener('submit', async event => {
  event.preventDefault();
  const form = new FormData(event.target);
  const card = $('#order-chat-card');
  const note = $('#order-message-note');
  const button = event.target.querySelector('button[type="submit"]');
  if (button) button.disabled = true;
  if (note) note.textContent = 'Enviando mensagem…';
  try {
    await apiRequest(`/api/store/orders/${encodeURIComponent(card.dataset.orderId)}/messages`, { method: 'POST', body: JSON.stringify({ content: form.get('content') }) });
    event.target.reset();
    if (note) note.textContent = 'Mensagem enviada. A conversa atualiza automaticamente.';
    await refreshOrderChat();
  } catch (error) { if (note) note.textContent = error.message; }
  finally { if (button) button.disabled = false; }
});
if ($('#order-chat-card')) {
  refreshOrderChat();
  window.setInterval(refreshOrderChat, 4000);
}
$('[data-focus-search]')?.addEventListener('click', () => { if (currentPath !== '/shop') window.location.href = route('/shop'); else $('#search')?.focus(); });
$('#newsletter')?.addEventListener('submit', event => { event.preventDefault(); $('#newsletter-note').textContent = 'Sinal captado. Você será o primeiro a saber do próximo drop.'; $('#newsletter-note').classList.add('success'); event.target.reset(); });
$('#contact-form')?.addEventListener('submit', event => { event.preventDefault(); $('#contact-note').textContent = 'Mensagem recebida. Voltamos em breve.'; $('#contact-note').classList.add('success'); event.target.reset(); });
document.addEventListener('mousemove', event => { document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`); document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`); });
document.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); if (currentPath !== '/shop') window.location.href = route('/shop'); else $('#search')?.focus(); } if (event.key === 'Escape') document.body.classList.remove('cart-open'); });
if (currentPath === '/shop') { const params = new URLSearchParams(window.location.search); const category = params.get('category'); if (category) filterCatalog(category); }
