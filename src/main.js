import './styles.css';

const API_BASE = window.__RYNEX_API_URL__ || import.meta.env.VITE_RYNEX_API_URL || '';
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const SESSION_KEY = 'rynex-session';
const getSession = () => { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; } };
let profileAvatarDraft = getSession()?.user?.avatar || null;
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
const normaliseProduct = product => ({ id: String(product.id), name: String(product.name || 'Produto'), category: String(product.category || 'Geral'), price: Number(product.price || 0), imageUrl: /^https?:\/\//i.test(product.imageUrl || '') ? product.imageUrl : '', url: /^https?:\/\//i.test(product.url || '') ? product.url : '', description: String(product.description || ''), tag: String(product.tag || 'IN STOCK'), tone: String(product.tone || 'violet'), visual: String(product.visual || 'tee'), code: String(product.code || product.id), stock: product.stock == null ? null : Math.max(0, Math.floor(Number(product.stock) || 0)), digital: product.digital === true, active: product.active !== false });
const isProductInStock = product => product.stock == null || product.stock > 0;

let products = [
  {
    id: 'blox-god-human-max',
    name: 'CONTA COM GOD HUMAN E LV MAX',
    category: 'Blox Fruits',
    price: 1.10,
    imageUrl: 'https://ttetobr-spec.github.io/Rynex/products/conta-god-human.webp',
    description: 'Conta de Blox Fruits com God Human e nível máximo.',
    tag: 'CONTA DIGITAL',
    tone: 'violet',
    code: 'BF01',
    visual: 'account',
    stock: 0,
    digital: true,
    active: true,
  },
  {
    id: 'random-mitica-1-3-miticas',
    name: 'RANDOM MÍTICA 1-3 MÍTICAS',
    category: 'Blox Fruits',
    price: 2.50,
    imageUrl: 'https://ttetobr-spec.github.io/Rynex/products/random-mythic.webp',
    description: 'Random de Blox Fruits com 1 a 3 frutas míticas.',
    tag: 'RANDOM MÍTICA',
    tone: 'orange',
    code: 'BF02',
    visual: 'account',
    stock: 12,
    digital: true,
    active: true,
  },
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
  { name: 'Blox Fruits', count: '02 itens', tone: 'violet', glyph: '✦' },
];
if (remoteCatalog?.products?.length) products = remoteCatalog.products.map(normaliseProduct);
if (remoteCatalog?.categories?.length) categories = remoteCatalog.categories.map((name, index) => ({ name, count: `${products.filter(product => product.category === name).length} items`, tone: ['violet', 'cyan', 'orange', 'pink'][index % 4], glyph: ['✦', '◒', '↗', '⌁'][index % 4] }));
const storeSettings = remoteCatalog?.settings || {};
const heroWords = String(storeSettings.heroTitle || 'God Human LV Max').trim().split(/\s+/);
const heroTitleMarkup = `${escapeHtml(heroWords.slice(0, -2).join(' '))}<br><strong>${escapeHtml(heroWords.slice(-2).join(' '))}</strong>`;
const money = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const siteBase = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
const route = (path) => `${siteBase}${path === '/' ? '/' : path}`;
const asset = (path) => `${siteBase}${path}`;
const icon = (name, size = 20) => {
  const paths = { search: '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path>', bag: '<path d="M6 8h12l1 12H5L6 8Z"></path><path d="M9 8a3 3 0 0 1 6 0"></path>', arrow: '<path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path>', close: '<path d="m6 6 12 12M18 6 6 18"></path>', plus: '<path d="M12 5v14M5 12h14"></path>', minus: '<path d="M5 12h14"></path>', chevron: '<path d="m6 9 6 6 6-6"></path>', spark: '<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z"></path>', headphones: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"></path><path d="M4 14h3v5H5a1 1 0 0 1-1-1v-4Zm16 0h-3v5h2a1 1 0 0 0 1-1v-4Z"></path>', user: '<circle cx="12" cy="8" r="3"></circle><path d="M5 20a7 7 0 0 1 14 0"></path>' };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.spark}</svg>`;
};
const LEGACY_CART_KEY = 'erynex-cart';
const GUEST_CART_KEY = 'erynex-cart:guest';
const cartStorageKey = (session = getSession()) => session?.user?.id ? `erynex-cart:user:${String(session.user.id)}` : GUEST_CART_KEY;
try { localStorage.removeItem(LEGACY_CART_KEY); } catch {}
const readCartData = key => { try { const data = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(data) ? data : []; } catch { return []; } };
const getCart = () => readCartData(cartStorageKey()).map(item => ({ product: products.find(p => String(p.id) === String(item.id)), quantity: Math.min(20, Math.max(1, Math.floor(Number(item.quantity) || 1))) })).filter(item => item.product);
let cart = getCart();
const saveCart = () => localStorage.setItem(cartStorageKey(), JSON.stringify(cart.map(item => ({ id: item.product.id, quantity: item.quantity }))));
const adoptGuestCart = () => {
  const session = getSession();
  if (!session?.user?.id) return;
  const guestItems = readCartData(GUEST_CART_KEY);
  const accountKey = cartStorageKey(session);
  if (guestItems.length) {
    const merged = new Map();
    for (const item of [...readCartData(accountKey), ...guestItems]) {
      const id = String(item?.id ?? '');
      if (!id) continue;
      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
      merged.set(id, Math.min(20, (merged.get(id) || 0) + quantity));
    }
    localStorage.setItem(accountKey, JSON.stringify([...merged].map(([id, quantity]) => ({ id, quantity }))));
    localStorage.removeItem(GUEST_CART_KEY);
  }
  cart = getCart();
};
const cartCount = () => cart.reduce((total, item) => total + item.quantity, 0);
const rawPath = window.location.pathname;
const currentPath = (siteBase && rawPath.startsWith(siteBase) ? rawPath.slice(siteBase.length) : rawPath).replace(/\/$/, '') || '/';
const currentProduct = products.find(product => currentPath === `/product/${product.id}`) || products[0];

const productVisual = (product, large = false) => `<div class="product-visual ${product.tone} ${large ? 'large' : ''} visual-${product.visual || 'tee'}">${product.imageUrl ? `<img class="product-image" src="${product.imageUrl}" alt="${product.name}" loading="lazy" />` : ''}<div class="visual-noise"></div><div class="visual-grid"></div><span class="visual-code">ER / ${product.code}</span>${product.imageUrl ? '' : `<div class="visual-object"><span></span><i></i><b></b></div>`}<div class="visual-scan"></div><strong>${product.code}</strong><em>${product.category}</em></div>`;
const productCard = (product, index = 0) => {
  const href = product.url || route(`/product/${product.id}`);
  const inStock = isProductInStock(product);
  const addButton = inStock
    ? `<button class="quick-add" type="button" data-add="${product.id}">${icon('plus', 15)}<span>Adicionar</span></button>`
    : '<button class="quick-add is-disabled" type="button" disabled aria-label="Produto esgotado"><span>Esgotado</span></button>';
  return `<article class="product-card reveal ${inStock ? '' : 'out-of-stock'}" data-category="${product.category}" data-id="${product.id}" style="--delay:${index * 60}ms"><a href="${href}" class="card-image-wrap"><button class="wishlist" type="button" aria-label="Favoritar">♡</button>${productVisual(product)}<span class="product-tag ${inStock ? '' : 'is-out-of-stock'}">${inStock ? product.tag : 'ESGOTADO'}</span>${addButton}</a><div class="product-meta"><div><span class="eyebrow">${product.category}</span><h3><a href="${href}">${product.name}</a></h3>${product.stock > 0 ? `<span class="product-stock-count">${product.stock} unidades disponíveis</span>` : ''}</div><strong>${money(product.price)}</strong></div></article>`;
};
const logo = `<img class="brand-logo" src="${asset('/erynex-logo.png')}" alt="E Rynex logo" />`;
const avatarMarkup = (user, className = 'account-avatar') => user?.avatar
  ? `<img class="${className}" src="${escapeHtml(user.avatar)}" alt="Foto de perfil" />`
  : `<span class="${className} avatar-fallback" aria-hidden="true">${escapeHtml(String(user?.name || user?.username || 'R').trim().slice(0, 1).toUpperCase() || 'R')}</span>`;
const headerAccount = () => { const user = getSession()?.user; return user ? `${avatarMarkup(user, 'header-avatar')}<span>Minha conta</span>` : 'Entrar'; };
const header = (active = '') => `<div class="announcement"><span class="pulse-dot"></span><span>DROP 04.26</span><b>ENTRE NO FUTURO ANTES DE TODO MUNDO</b><a href="${route('/shop')}">Explorar agora ${icon('arrow', 14)}</a></div><header class="site-header reference-header"><a href="${route('/')}" class="brand" aria-label="E Rynex início">${logo}<span class="brand-name">E ${escapeHtml(storeSettings.brandName || 'Rynex').toUpperCase()}<small>THE NEXT DROP</small></span></a><nav class="main-nav"><a class="${active === 'home' ? 'active' : ''}" href="${route('/')}">Início</a><a class="${active === 'shop' ? 'active' : ''}" href="${route('/shop')}">Drops</a><a class="${active === 'about' ? 'active' : ''}" href="${route('/about')}">Manifesto</a><a href="${route('/contact')}">Contato</a></nav><div class="header-actions"><button class="header-search" data-focus-search>${icon('search', 19)}<span>Pesquisar produto</span></button><button class="support-button" aria-label="Suporte">${icon('headphones', 22)}</button><a class="cart-button reference-cart" href="${route('/cart')}">${icon('bag', 20)}<span>Carrinho</span><b class="cart-count ${cartCount() ? 'visible' : ''}">${cartCount()}</b></a><a class="login-button" href="${route(getSession()?.user ? '/account' : '/login')}">${headerAccount()}</a><button class="menu-button" data-menu aria-label="Abrir menu">☰</button></div></header>`;
const footer = `<footer class="site-footer section-shell"><a href="${route('/')}" class="brand">${logo}<span class="brand-name">E ${escapeHtml(storeSettings.brandName || 'Rynex').toUpperCase()}<small>THE NEXT DROP</small></span></a><p>Para quem não nasceu para o óbvio.</p><div class="footer-links"><a href="${route('/about')}">Manifesto</a><a href="${route('/shop')}">Drops</a><a href="${route('/contact')}">Contato</a><a href="#">Instagram ↗</a></div><span class="copyright">© 2026 E Rynex</span></footer>`;
const cartDrawer = `<div class="cart-overlay" data-close-cart></div><aside class="cart-drawer" aria-label="Carrinho de compras"><div class="drawer-head"><div><span class="eyebrow">YOUR FREQUENCY</span><h2>Seu carrinho <span class="cart-count-text">(${cartCount()})</span></h2></div><button class="icon-button" data-close-cart>${icon('close', 21)}</button></div><div class="cart-items" id="cart-items"></div><div class="cart-empty ${cart.length ? 'hidden' : ''}" id="cart-empty"><div class="empty-bag">${icon('bag', 30)}</div><h3>Seu carrinho está vazio.</h3><p>Adicione um drop para começar sua próxima frequência.</p><a class="button button-outline" href="${route('/shop')}">Explorar drops</a></div><div class="cart-summary ${cart.length ? 'visible' : ''}" id="cart-summary"><div><span>Subtotal</span><strong id="cart-subtotal">${money(cart.reduce((total, item) => total + item.product.price * item.quantity, 0))}</strong></div><p>Frete calculado no checkout</p><button class="button button-light checkout-button" data-checkout ${cart.some(item => !isProductInStock(item.product)) ? 'disabled' : ''}>Ir para checkout ${icon('arrow', 16)}</button></div></aside>`;
const pageShell = (content, active) => `<div class="cursor-glow"></div>${header(active)}<main>${content}</main>${footer}${cartDrawer}<div class="toast" id="toast"><span>✦</span><p>Adicionado ao carrinho</p></div>`;

function accountNavigation(active) {
  return `<nav class="account-nav" aria-label="Navegação da conta"><a class="${active === 'profile' ? 'active' : ''}" href="${route('/account')}">Meu perfil</a><a class="${active === 'settings' ? 'active' : ''}" href="${route('/settings')}">Configurações</a><a class="${active === 'orders' ? 'active' : ''}" href="${route('/orders')}">Meus pedidos</a></nav>`;
}
function accountAccessPage() {
  const returnTo = `${currentPath}${window.location.search}`;
  const loginHref = route(`/login?return=${encodeURIComponent(returnTo)}`);
  const registerHref = route(`/register?return=${encodeURIComponent(returnTo)}`);
  return `<section class="page-hero auth-hero section-shell"><span class="section-kicker"><i></i> Rynex account</span><h1>Entre na<br><span>sua conta.</span></h1><p>Faça login para ver seu perfil e suas configurações.</p></section><section class="auth-section section-shell"><div class="auth-card"><span class="section-kicker"><i></i> Área protegida</span><h2>Continue de onde parou.</h2><a class="button button-light full" href="${loginHref}">Entrar ${icon('arrow', 16)}</a><a class="button button-outline full auth-secondary-link" href="${registerHref}">Criar conta</a></div><aside class="auth-aside"><span class="section-kicker"><i></i> Seu canal pessoal</span><h2>Pedidos,<br><em>perfil e ajustes.</em></h2><p>Entre para acompanhar suas compras e conversar com a equipe.</p></aside></section>`;
}
function signedInPage() {
  return `<section class="page-hero auth-hero section-shell"><span class="section-kicker"><i></i> Rynex account</span><h1>Sessão<br><span>ativa.</span></h1><p>Você já está conectado à sua conta.</p></section><section class="auth-section section-shell"><div class="auth-card"><a class="button button-light full" href="${route('/account')}">Minha conta ${icon('arrow', 16)}</a><a class="button button-outline full auth-secondary-link" href="${route('/settings')}">Configurações</a></div><aside class="auth-aside"><span class="section-kicker"><i></i> E Rynex</span><h2>Seu espaço,<br><em>do seu jeito.</em></h2><p>Atualize seu perfil ou ajuste a segurança da conta.</p></aside></section>`;
}
function loginPage() {
  if (getSession()?.user) return signedInPage();
  const returnPath = new URLSearchParams(window.location.search).get('return') || '/cart';
  const registerHref = route(`/register?return=${encodeURIComponent(returnPath)}`);
  return `<section class="page-hero auth-hero section-shell"><span class="section-kicker"><i></i> Rynex account / 01</span><h1>Entre no<br><span>seu canal.</span></h1><p>Faça login para acompanhar pedidos e conversar com a equipe.</p></section><section class="auth-section section-shell"><div class="auth-card"><span class="section-kicker"><i></i> Acesso seguro</span><h2>Entrar na conta</h2><form id="login-form"><label>E-mail<input name="email" type="email" placeholder="seu@gmail.com" autocomplete="email" required /></label><label>Senha<input name="password" type="password" autocomplete="current-password" minlength="8" required /></label><button class="button button-light full" type="submit">Entrar ${icon('arrow', 16)}</button><p id="login-note" class="auth-note" aria-live="polite">A senha é validada pelo servidor e não fica no navegador.</p></form><div class="auth-page-links"><span>Ainda não tem conta?</span><a href="${registerHref}">Criar conta</a></div></div><aside class="auth-aside"><span class="section-kicker"><i></i> Seu pedido, sem ruído</span><h2>Do pagamento<br><em>à entrega.</em></h2><p>Entre para ver seu pedido, receber a entrega manual e conversar com a equipe.</p></aside></section>`;
}
function registerPage() {
  if (getSession()?.user) return signedInPage();
  const returnPath = new URLSearchParams(window.location.search).get('return') || '/cart';
  const loginHref = route(`/login?return=${encodeURIComponent(returnPath)}`);
  return `<section class="page-hero auth-hero section-shell"><span class="section-kicker"><i></i> Rynex account / 02</span><h1>Crie seu<br><span>acesso.</span></h1><p>Uma conta para acompanhar seus pedidos e receber suporte.</p></section><section class="auth-section section-shell"><div class="auth-card"><span class="section-kicker"><i></i> Nova conta</span><h2>Criar conta</h2><form id="register-form"><label>Nome<input name="name" placeholder="Como podemos chamar você?" minlength="2" maxlength="100" autocomplete="name" required /></label><label>Nome de usuário<input name="username" placeholder="rynex-user" minlength="3" maxlength="40" autocomplete="username" required /></label><label>Gmail / e-mail<input name="email" type="email" placeholder="seu@gmail.com" autocomplete="email" required /></label><label>Senha<input name="password" type="password" autocomplete="new-password" minlength="8" required /></label><button class="button button-light full" type="submit">Criar conta ${icon('arrow', 16)}</button><p id="register-note" class="auth-note" aria-live="polite">Use uma senha com pelo menos 8 caracteres.</p></form><div class="auth-page-links"><span>Já tem uma conta?</span><a href="${loginHref}">Entrar</a></div></div><aside class="auth-aside"><span class="section-kicker"><i></i> E Rynex account</span><h2>Seu pedido,<br><em>em um só lugar.</em></h2><p>Crie o acesso para acompanhar a compra e conversar com a equipe pelo site.</p></aside></section>`;
}
function accountPage() {
  const account = getSession()?.user;
  if (!account) return accountAccessPage();
  return `<section class="page-hero auth-hero section-shell"><span class="section-kicker"><i></i> Rynex account</span><h1>Minha<br><span>conta.</span></h1><p>Seu perfil e seus dados de contato.</p></section><section class="account-dashboard section-shell">${accountNavigation('profile')}<div class="account-dashboard-grid"><div class="auth-card account-card"><span class="section-kicker"><i></i> Perfil</span><h2>Olá, ${escapeHtml(account.name || account.username)}.</h2><div class="profile-avatar-control"><div class="profile-avatar-preview" id="avatar-preview">${avatarMarkup(account, 'profile-avatar-image')}</div><div class="profile-avatar-tools"><label class="avatar-pick-label" for="avatar-file">Escolher foto</label><input id="avatar-file" type="file" accept="image/png,image/jpeg,image/webp" hidden /><button class="avatar-remove-button" id="remove-avatar" type="button">Remover foto</button><p class="avatar-help">PNG, JPG ou WEBP; a imagem é ajustada automaticamente.</p><p class="auth-note" id="avatar-note" aria-live="polite">Até 10 MB na seleção; salvamos uma versão comprimida de até 180 KB.</p></div></div><form id="profile-form"><label>Nome<input name="name" value="${escapeHtml(account.name || '')}" minlength="2" maxlength="100" autocomplete="name" required /></label><label>Nome de usuário<input name="username" value="${escapeHtml(account.username || '')}" minlength="3" maxlength="40" autocomplete="username" required /></label><label>E-mail<input name="email" type="email" value="${escapeHtml(account.email || '')}" autocomplete="email" required /></label><button class="button button-light full" type="submit">Salvar perfil ${icon('arrow', 16)}</button><p id="profile-note" class="auth-note" aria-live="polite">Sua senha e o encerramento de sessão ficam em Configurações.</p></form></div><aside class="auth-aside account-aside"><span class="section-kicker"><i></i> Área da conta</span><h2>Seu sinal,<br><em>sua identidade.</em></h2><p>Atualize seu nome, usuário, e-mail e foto. Para alterar a senha ou sair, abra Configurações.</p><a class="arrow-link" href="${route('/settings')}">Abrir configurações ${icon('arrow', 16)}</a></aside></div></section>`;
}
function settingsPage() {
  const account = getSession()?.user;
  if (!account) return accountAccessPage();
  return `<section class="page-hero auth-hero section-shell"><span class="section-kicker"><i></i> Rynex account</span><h1>Configurações<br><span>da conta.</span></h1><p>Segurança e sessão da sua conta.</p></section><section class="account-dashboard section-shell">${accountNavigation('settings')}<div class="account-dashboard-grid"><div class="account-settings-stack"><div class="auth-card account-card"><span class="section-kicker"><i></i> Segurança</span><h2>Redefinir senha</h2><p class="settings-description">Confirme sua senha atual para escolher uma nova.</p><form id="change-password-form"><label>Senha atual<input name="currentPassword" type="password" autocomplete="current-password" required /></label><label>Nova senha<input name="newPassword" type="password" autocomplete="new-password" minlength="8" required /></label><label>Confirmar nova senha<input name="confirmPassword" type="password" autocomplete="new-password" minlength="8" required /></label><button class="button button-light full" type="submit">Atualizar senha ${icon('arrow', 16)}</button><p id="settings-note" class="auth-note" aria-live="polite">Use ao menos 8 caracteres. A senha atual é necessária para confirmar a alteração.</p></form><p class="settings-description">Se você esqueceu a senha atual, a recuperação por e-mail ainda depende da configuração de um serviço de envio seguro.</p></div><div class="auth-card account-card logout-card"><span class="section-kicker"><i></i> Sessão</span><h2>Sair da conta</h2><p class="settings-description">Encerra sua sessão neste navegador.</p><button class="button button-outline full account-logout" type="button" id="logout-button">Sair da conta</button></div></div><aside class="auth-aside account-aside"><span class="section-kicker"><i></i> Sua conta</span><h2>Proteja seu<br><em>acesso.</em></h2><p>Conta: ${escapeHtml(account.email || '')}</p><a class="arrow-link" href="${route('/account')}">Voltar ao perfil ${icon('arrow', 16)}</a></aside></div></section>`;
}

function ordersPage() {
  const account = getSession()?.user;
  if (!account) return accountAccessPage();
  return `<section class="page-hero auth-hero section-shell"><span class="section-kicker"><i></i> Rynex account</span><h1>Meus<br><span>pedidos.</span></h1><p>Histórico, pagamento e atendimento em páginas separadas do carrinho.</p></section><section class="account-dashboard section-shell">${accountNavigation('orders')}<div class="account-dashboard-grid"><div><div id="account-orders-list" class="orders-list"><article class="auth-card order-history-card"><p class="order-note">Carregando seus pedidos…</p></article></div></div><aside class="auth-aside account-aside"><span class="section-kicker"><i></i> Seu histórico</span><h2>Da compra<br><em>à entrega.</em></h2><p>Cada pedido abre seu QR Pix e uma conversa privada com a equipe. O link exige login na conta que fez a compra.</p><a class="arrow-link" href="${route('/cart')}">Abrir carrinho ${icon('arrow', 16)}</a></aside></div></section>`;
}

function homePage() {
  const heroProducts = products.filter(product => product.category.toLowerCase() === 'blox fruits').slice(0, 2);
  if (!heroProducts.length && products[0]) heroProducts.push(products[0]);
  const slides = heroProducts.map(product => {
    const isGodHuman = String(product.id) === 'blox-god-human-max';
    const stockLabel = product.stock == null ? 'CONFIRA ESTOQUE' : product.stock > 0 ? `${product.stock} DISPONÍVEIS` : 'ESGOTADO';
    const stockCopy = product.stock == null
      ? 'Consulte a disponibilidade na página do produto.'
      : product.stock > 0
        ? `${product.stock} unidades em estoque.`
        : 'Sem estoque no momento.';
    return {
      product,
      kicker: `BLOX FRUITS / ${isGodHuman ? 'CONTA DIGITAL' : 'RANDOM MÍTICA'}`,
      title: isGodHuman ? heroTitleMarkup : 'Random<br><strong>1–3 Míticas</strong>',
      copy: `${escapeHtml(product.description)} ${stockCopy}`,
      stockLabel,
    };
  });
  const slideMarkup = slides.map((slide, index) => `<article class="hero-slide ${index === 0 ? 'is-active' : ''}" data-hero-slide="${index}"><div class="slide-copy"><span class="slide-kicker">✦ ${slide.kicker}</span><h1>${slide.title}</h1><p>${slide.copy}</p><div class="slide-actions"><a class="button button-light" href="${route(`/product/${slide.product.id}`)}">Ver produto ${icon('arrow', 16)}</a><span class="slide-meta">${String(index + 1).padStart(2, '0')} <i></i> ${String(slides.length).padStart(2, '0')}</span></div></div><div class="slide-art"><img class="hero-product-banner-image" src="${escapeHtml(slide.product.imageUrl || asset('/erynex-symbol.png'))}" alt="${escapeHtml(slide.product.name)}" loading="eager" /><span class="slide-art-label">${escapeHtml(slide.product.name)} / ${money(slide.product.price)} · ${slide.stockLabel}</span></div></article>`).join('');
  const backdropMarkup = slides.map((slide, index) => `<div class="hero-backdrop-slide ${index === 0 ? 'is-active' : ''}" data-hero-background="${index}" aria-hidden="true">${productVisual(slide.product, true)}</div>`).join('');
  const productGrid = heroProducts.map((product, index) => productCard(product, index)).join('');
  const promoTitle = heroProducts.length > 1 ? 'Dois drops<br><strong>de Blox Fruits.</strong>' : 'Encontre seu<br><strong>próximo drop.</strong>';
  return `<div class="reference-home"><section class="reference-hero section-shell fullscreen-banner"><div class="hero-backdrop">${backdropMarkup}</div><div class="hero-carousel"><button class="hero-arrow hero-prev" type="button" aria-label="Slide anterior" data-hero-prev>‹</button><div class="hero-slides">${slideMarkup}</div><button class="hero-arrow hero-next" type="button" aria-label="Próximo slide" data-hero-next>›</button><div class="hero-dots">${slides.map((_, index) => `<button class="${index === 0 ? 'is-active' : ''}" data-hero-dot="${index}" aria-label="Slide ${index + 1}"></button>`).join('')}</div></div></section><section class="reference-section best-sellers section-shell"><div class="reference-section-head"><div><span class="section-kicker"><i></i> Blox Fruits / vitrine da loja</span><h2>Produtos em destaque</h2></div><a href="${route('/shop')}" class="reference-link">Ver catálogo ${icon('arrow', 15)}</a></div><div class="reference-product-grid">${productGrid}</div></section><section class="reference-promo section-shell"><div><span class="section-kicker"><i></i> Estoque atualizado</span><h2>${promoTitle}</h2><p>Preço e disponibilidade aparecem em cada produto e são conferidos novamente no checkout.</p><a class="button button-light" href="${route('/shop')}">Ver catálogo ${icon('arrow', 16)}</a></div><div class="promo-symbol"><img src="${asset('/erynex-symbol.png')}" alt="Símbolo E Rynex" /></div></section><section class="newsletter section-shell reveal"><div><span class="section-kicker"><i></i> Stay in the loop</span><h2>Receba o sinal<br><em>antes de todo mundo.</em></h2></div><form id="newsletter"><input type="email" placeholder="seu@email.com" required /><button class="button button-light">Entrar na lista ${icon('arrow', 15)}</button></form><p class="form-note" id="newsletter-note">Sem spam. Só drops e ideias que merecem espaço.</p></section></div>`;
}
function shopPage() {
  return `<section class="page-hero section-shell"><span class="section-kicker"><i></i> The E Rynex catalog / 04.26</span><h1>Todos os<br><span>sinais.</span></h1><p>Explore a coleção completa. Cada peça nasce para sair do ruído e entrar no seu ritmo.</p></section><section class="shop-section section-shell"><div class="catalog-toolbar"><p><strong id="result-count">${String(products.length).padStart(2, '0')}</strong> sinais encontrados</p><label class="search-field">${icon('search', 17)}<input id="search" type="search" placeholder="Buscar no catálogo..." /><span>/</span></label><button class="sort-button">Mais recentes ${icon('chevron', 15)}</button></div><div class="shop-layout"><aside class="shop-filters"><span class="eyebrow">Filtrar por frequência</span><button class="filter active" data-filter="All">Tudo <b>${String(products.length).padStart(2, '0')}</b></button>${categories.map(cat => `<button class="filter" data-filter="${cat.name}">${cat.name} <b>${cat.count.split(' ')[0]}</b></button>`).join('')}<div class="filter-note">DROP 04.26<br><span>O próximo sinal já está aqui.</span></div></aside><div><div class="products-grid" id="products-grid">${products.map(productCard).join('')}</div><div class="empty-state" id="empty-state"><span>${icon('search', 28)}</span><h3>Nenhum sinal encontrado</h3><p>Tente outra busca ou explore uma categoria diferente.</p><button class="text-link" data-clear-search>Limpar filtros ↗</button></div></div></div></section>`;
}
function aboutPage() {
  return `<section class="page-hero about-hero section-shell"><span class="section-kicker"><i></i> E Rynex studio / 2026</span><h1>Feito para<br><span>o incomum.</span></h1><p>Somos um estúdio independente de objetos, roupas e ideias para quem transforma diferença em direção.</p></section><section class="about-intro section-shell"><div class="manifesto-mark"><img src="${asset('/erynex-symbol.png')}" alt="Logo E Rynex" /></div><div><span class="section-kicker"><i></i> Our frequency</span><h2>Não é sobre<br><em>seguir tendência.</em></h2><p>E Rynex nasceu do encontro entre forma, movimento e tecnologia. A gente acredita que o estilo não precisa pedir licença — ele só precisa dizer algo verdadeiro sobre quem usa.</p><p>Cada drop é limitado, pensado em detalhes e criado para viver fora da lógica do descartável. Menos ruído. Mais presença.</p></div></section><section class="timeline-section section-shell"><span class="section-kicker"><i></i> How we move</span><div class="timeline"><div><span>01</span><h3>Observar</h3><p>Encontrar beleza onde o algoritmo ainda não chegou.</p></div><div><span>02</span><h3>Construir</h3><p>Transformar uma ideia em matéria, função e sensação.</p></div><div><span>03</span><h3>Emitir</h3><p>Colocar algo novo no mundo e deixar que ele encontre você.</p></div></div></section><section class="about-quote section-shell"><p>“O comum é um ponto de partida.”</p><span>— E Rynex / signal 001</span></section>`;
}
function productPage(product) {
  const related = products.filter(item => item.id !== product.id && item.category === product.category).slice(0, 3);
  const inStock = isProductInStock(product);
  const purchaseOptions = product.digital
    ? `<div class="product-digital-note"><strong>Produto digital</strong><span>${escapeHtml(product.tag || product.category)}</span></div>`
    : '<div class="option-group"><span>Selecione o tamanho</span><div class="options"><button class="option active">P</button><button class="option">M</button><button class="option">G</button><button class="option">GG</button></div></div>';
  const deliveryDetails = product.digital
    ? `<span>⌁ Produto digital</span><span>↻ Entrega manual pela equipe</span><span>✦ Atendimento pelo pedido</span>${product.stock > 0 ? `<span class="product-stock-inline">✓ ${product.stock} unidades em estoque</span>` : ''}`
    : '<span>⌁ Envio em até 48h</span><span>↻ Troca fácil em 30 dias</span><span>✦ Drop limitado E Rynex</span>';
  const purchaseButton = inStock
    ? `<button class="button button-light full" data-add="${product.id}">Adicionar ao carrinho ${icon('arrow', 17)}</button>`
    : '<button class="button button-outline full" type="button" disabled>Sem estoque no momento</button>';
  return `<section class="breadcrumb section-shell"><a href="${route('/shop')}">Drops</a><span>/</span><span>${product.name}</span></section><section class="product-detail section-shell"><div class="detail-visual">${productVisual(product, true)}<span class="detail-stamp">ER / ${product.code}<br>${inStock ? 'AVAILABLE' : 'ESGOTADO'}</span></div><div class="detail-copy"><span class="section-kicker"><i></i> ${inStock ? product.tag : 'ESGOTADO'}</span><h1>${product.name}</h1><span class="modal-category">${product.category} / E Rynex Studio</span><p>${product.description}</p><div class="detail-price">${money(product.price)}${product.digital ? '' : ' <small>ou 3x sem juros</small>'}</div>${purchaseOptions}${purchaseButton}${inStock ? '' : '<p class="stock-notice">Este produto está temporariamente esgotado.</p>'}<div class="modal-details">${deliveryDetails}</div></div></section><section class="products related section-shell"><div class="section-heading"><div><span class="section-kicker"><i></i> You may also like</span><h2>Mais da <em>frequência.</em></h2></div><a class="arrow-link" href="${route('/shop')}">Ver catálogo ${icon('arrow', 16)}</a></div><div class="products-grid">${related.map(productCard).join('')}</div></section>`;
}
const getLastOrder = () => { try { return JSON.parse(localStorage.getItem('rynex-last-order') || 'null'); } catch { return null; } };
function orderTrackingUrl(orderId) { return new URL(`${route('/')}?order=${encodeURIComponent(orderId)}`, window.location.origin).toString(); }
function orderChatPanel(order) {
  let payment = order.payment || null;
  try { payment ||= JSON.parse(localStorage.getItem(`rynex-payment-${order.id}`) || 'null'); } catch {}
  const status = order.status === 'awaiting_delivery' || order.status === 'paid' ? 'Pagamento confirmado / aguardando entrega' : order.status === 'payment_rejected' ? 'Pagamento recusado' : 'Aguardando pagamento';
  const trackingUrl = orderTrackingUrl(order.id);
  return `<section class="order-chat-section"><div class="order-chat-card" id="order-chat-card" data-order-id="${escapeHtml(order.id)}"><div class="section-kicker"><i></i> Atendimento do pedido</div><div class="order-chat-head"><div><h2>Pedido ${escapeHtml(order.id)}</h2><p>Converse por aqui; as mensagens também chegam ao canal privado no Discord.</p></div><span class="order-status" id="order-status">${status}</span></div><div class="order-summary"><h3 class="order-summary-title">Resumo da compra</h3><span class="order-summary-items">${(order.items || []).map(item => `${item.quantity}× ${escapeHtml(item.name)}`).join(' · ')}</span><strong><span class="order-summary-total-label">Total do pedido</span>${money(order.total || 0)}</strong></div><div class="order-link-actions"><span>Link de acompanhamento</span><button class="button button-outline" type="button" data-copy-order-link="${escapeHtml(trackingUrl)}">Copiar link do pedido</button></div>${Number(order.total) > 0 ? `<div class="order-payment"><strong>Pagamento por Pix</strong>${payment?.qrCodeDataUrl ? `<div class="pix-payment-grid"><div class="pix-qr-wrap"><img class="pix-qr-code" src="${escapeHtml(payment.qrCodeDataUrl)}" alt="QR Code Pix do pedido ${escapeHtml(order.id)}" /><span>Escaneie com o app do seu banco</span></div><div class="pix-copy-area"><label for="pix-copy-code">Pix copia e cola</label><textarea id="pix-copy-code" class="pix-copy-code" readonly>${escapeHtml(payment.copyPaste || '')}</textarea><button class="button button-light" type="button" data-copy-pix>Copiar código Pix</button><p class="pix-manual-note">${escapeHtml(payment.instructions || 'Envie o comprovante no atendimento; um administrador confirmará o pagamento manualmente.')}</p></div></div>${payment?.pixKey ? `<p class="pix-key-line">Chave recebedora: <code>${escapeHtml(payment.pixKey)}</code></p>` : ''}` : `<p>${escapeHtml(payment?.instructions || 'A chave Pix ainda não foi configurada pela equipe.')}</p>${payment?.pixKey ? `<p>Chave Pix: <code>${escapeHtml(payment.pixKey)}</code></p>` : ''}<button class="button button-outline" type="button" data-generate-pix>Gerar QR Pix</button><p class="pix-manual-note" id="pix-generation-note">Se a equipe já configurou a chave Pix, gere o QR aqui.</p>`}</div>` : ''}<div class="order-messages" id="order-messages" aria-live="polite"><p class="order-note">Carregando conversa…</p></div><form class="order-message-form" id="order-message-form"><label for="order-message-input">Sua mensagem</label><textarea id="order-message-input" name="content" maxlength="1800" placeholder="Escreva para a equipe…" required></textarea><button class="button button-light" type="submit">Enviar mensagem ${icon('arrow', 16)}</button><p class="order-note" id="order-message-note">A equipe responde pelo Discord; a resposta aparece aqui automaticamente.</p></form></div></section>`;
}
function cartPage() {
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const session = getSession();
  const linkedOrderId = new URLSearchParams(window.location.search).get('order');
  const storedOrder = getLastOrder();
  const linkedOrder = linkedOrderId && storedOrder?.id === linkedOrderId ? storedOrder : null;
  const orderPanel = linkedOrderId ? (linkedOrder ? orderChatPanel(linkedOrder) : `<section class="order-chat-section" id="linked-order-content"><div class="order-chat-card"><p class="order-note">Carregando seu pedido…</p></div></section>`) : '';
  const showCart = !linkedOrderId && cart.length > 0;
  const emptyCart = `<div class="cart-page-empty"><div class="empty-bag">${icon('bag', 35)}</div><h2>Seu carrinho está vazio.</h2><p>Pedidos em aberto ficam em <a href="${route('/orders')}">Meus pedidos</a> e não bloqueiam novas compras.</p><a class="button button-light" href="${route('/shop')}">Explorar drops ${icon('arrow', 16)}</a></div>`;
  const summary = showCart ? `<aside class="cart-page-summary"><span class="eyebrow">Order summary</span><h2>Resumo do pedido</h2><div><span>Subtotal</span><strong>${money(subtotal)}</strong></div><div><span>Frete</span><strong class="free">A combinar</strong></div><hr><div><span>Total estimado</span><strong>${money(subtotal)}</strong></div>${session ? `<form id="checkout-form" class="checkout-form"><label>E-mail de contato<input name="email" type="email" value="${escapeHtml(session.user?.email || '')}" required /></label><label>ID do Discord <small>opcional, para liberar o canal ao cliente</small><input name="discordUserId" inputmode="numeric" placeholder="Ex.: 123456789012345678" /></label><label>Cupom<input name="coupon" placeholder="RYNEX-TEST" /></label><button class="button button-light full" type="submit" ${cart.some(item => !isProductInStock(item.product)) ? 'disabled' : ''}>Criar pedido e gerar Pix ${icon('arrow', 16)}</button>${cart.some(item => !isProductInStock(item.product)) ? '<p class="stock-notice">Remova do carrinho os itens que estão esgotados antes de finalizar.</p>' : ''}<p id="checkout-note">${escapeHtml(storeSettings.checkoutNote || 'O pedido gera QR Pix e código copia-e-cola automaticamente. A equipe confirma o pagamento manualmente.')}</p></form>` : `<a class="button button-light full" href="${route('/login?return=/cart')}">Entrar para finalizar ${icon('arrow', 16)}</a><p>Você precisa criar uma conta para acompanhar o pedido.</p>`}</aside>` : '';
  return `<section class="page-hero cart-page-hero section-shell"><span class="section-kicker"><i></i> Your frequency</span><h1>Seu<br><span>${linkedOrderId ? 'pedido.' : 'carrinho.'}</span></h1><p>${linkedOrderId ? 'Acompanhe seu pedido, o Pix e a conversa com a equipe.' : 'Revise seus sinais antes de seguir para o checkout.'}</p></section><section class="cart-page section-shell"><div id="cart-page-items">${showCart ? cart.map(item => cartItem(item)).join('') : orderPanel ? '' : emptyCart}</div>${summary}${orderPanel}</section>`;
}
const cartItem = item => `<div class="cart-page-item"><div class="cart-thumb">${productVisual(item.product)}</div><div><span class="eyebrow">${item.product.category}</span><h3>${item.product.name}</h3><strong>${money(item.product.price)}</strong>${isProductInStock(item.product) ? '' : '<span class="cart-item-unavailable">Esgotado</span>'}<div class="quantity"><button data-quantity="${item.product.id}" data-change="-1">${icon('minus', 13)}</button><span>${item.quantity}</span><button data-quantity="${item.product.id}" data-change="1" ${isProductInStock(item.product) ? '' : 'disabled'}>${icon('plus', 13)}</button></div></div><button class="remove-item" data-remove="${item.product.id}">${icon('close', 16)}</button></div>`;

const linkedOrderId = new URLSearchParams(window.location.search).get('order');
let content = linkedOrderId ? cartPage() : currentPath === '/' ? homePage() : currentPath === '/shop' ? shopPage() : currentPath === '/about' ? aboutPage() : currentPath === '/cart' ? cartPage() : currentPath === '/login' ? loginPage() : currentPath === '/register' ? registerPage() : currentPath === '/account' ? accountPage() : currentPath === '/settings' ? settingsPage() : currentPath === '/orders' ? ordersPage() : currentPath === '/contact' ? `<section class="page-hero section-shell"><span class="section-kicker"><i></i> Open channel</span><h1>Fale com<br><span>a gente.</span></h1><p>Para colaborações, dúvidas ou só para mandar um sinal, escreva para nós.</p></section><section class="contact-section section-shell"><form id="contact-form"><label>Seu nome<input required placeholder="Como podemos chamar você?" /></label><label>Seu e-mail<input required type="email" placeholder="seu@email.com" /></label><label>Mensagem<textarea required placeholder="Escreva seu sinal..."></textarea></label><button class="button button-light">Enviar mensagem ${icon('arrow', 16)}</button><p id="contact-note">Respondemos em até 48 horas.</p></form><div class="contact-aside"><span class="section-kicker"><i></i> E Rynex studio</span><h2>Sem ruído.<br><em>Direto ao ponto.</em></h2><p>São Paulo / Brasil<br>${escapeHtml(storeSettings.supportEmail || 'hello@erynex.com')}<br>@erynex.studio</p></div></section>` : currentPath.startsWith('/product/') ? productPage(currentProduct) : shopPage();
const active = linkedOrderId || ['/login', '/register', '/account', '/settings', '/orders'].includes(currentPath) ? '' : currentPath === '/' ? 'home' : currentPath === '/about' ? 'about' : 'shop';
document.querySelector('#app').innerHTML = pageShell(content, active);
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function renderCartDrawer() {
  const count = cartCount();
  $$('.cart-count').forEach(el => { el.textContent = count; el.classList.toggle('visible', count > 0); });
  const text = $('.cart-count-text'); if (text) text.textContent = `(${count})`;
  const items = $('#cart-items'); if (!items) return;
  $('#cart-empty').classList.toggle('hidden', cart.length > 0); $('#cart-summary').classList.toggle('visible', cart.length > 0);
  items.innerHTML = cart.map(item => `<div class="cart-item"><div class="cart-thumb">${productVisual(item.product)}</div><div class="cart-item-info"><span class="eyebrow">${item.product.category}</span><h3>${item.product.name}</h3><strong>${money(item.product.price)}</strong>${isProductInStock(item.product) ? '' : '<span class="cart-item-unavailable">Esgotado</span>'}<div class="quantity"><button data-quantity="${item.product.id}" data-change="-1">${icon('minus', 13)}</button><span>${item.quantity}</span><button data-quantity="${item.product.id}" data-change="1" ${isProductInStock(item.product) ? '' : 'disabled'}>${icon('plus', 13)}</button></div></div><button class="remove-item" data-remove="${item.product.id}">${icon('close', 15)}</button></div>`).join('');
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0); const subtotalNode = $('#cart-subtotal'); if (subtotalNode) subtotalNode.textContent = money(subtotal);
}
function addToCart(id) {
  const product = products.find(item => String(item.id) === String(id));
  if (!product) return;
  const toast = $('#toast');
  if (!isProductInStock(product)) {
    if (toast) { toast.querySelector('p').textContent = 'Este produto está esgotado'; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2200); }
    return;
  }
  const existing = cart.find(item => item.product.id === product.id);
  existing ? existing.quantity += 1 : cart.push({ product, quantity: 1 });
  saveCart(); renderCartDrawer();
  if (toast) { toast.querySelector('p').textContent = 'Adicionado ao carrinho'; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2200); }
}
function changeCart(id, delta) {
  const item = cart.find(entry => String(entry.product.id) === String(id));
  if (!item || (delta > 0 && !isProductInStock(item.product))) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart = cart.filter(entry => entry !== item);
  saveCart(); renderCartDrawer(); if (currentPath === '/cart') window.location.reload();
}
function filterCatalog(filter) { $$('.filter').forEach(btn => btn.classList.toggle('active', btn.dataset.filter === filter)); const query = ($('#search')?.value || '').toLowerCase().trim(); let visible = 0; $$('.product-card').forEach(card => { const product = products.find(item => String(item.id) === String(card.dataset.id)); const match = (filter === 'All' || product.category === filter) && (!query || `${product.name} ${product.category}`.toLowerCase().includes(query)); card.classList.toggle('is-hidden', !match); if (match) visible += 1; }); if ($('#result-count')) $('#result-count').textContent = String(visible).padStart(2, '0'); if ($('#empty-state')) $('#empty-state').classList.toggle('show', visible === 0); }

renderCartDrawer();
$$('.reveal').forEach(el => new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in-view'); }), { threshold: .05 }).observe(el));
const heroSlides = $$('.hero-slide');
const heroDots = $$('[data-hero-dot]');
const heroBackgrounds = $$('[data-hero-background]');
let heroIndex = 0;
const setHeroSlide = (index) => {
  if (!heroSlides.length) return;
  heroIndex = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, i) => slide.classList.toggle('is-active', i === heroIndex));
  heroDots.forEach((dot, i) => dot.classList.toggle('is-active', i === heroIndex));
  heroBackgrounds.forEach((background, i) => background.classList.toggle('is-active', i === heroIndex));
};
$$('[data-hero-prev]').forEach(button => button.addEventListener('click', () => setHeroSlide(heroIndex - 1)));
$$('[data-hero-next]').forEach(button => button.addEventListener('click', () => setHeroSlide(heroIndex + 1)));
heroDots.forEach(dot => dot.addEventListener('click', () => setHeroSlide(Number(dot.dataset.heroDot))));
if (heroSlides.length) window.setInterval(() => setHeroSlide(heroIndex + 1), 6500);
document.addEventListener('click', async event => {
  const generatePix = event.target.closest('[data-generate-pix]');
  if (generatePix) {
    const card = $('#order-chat-card');
    const note = $('#pix-generation-note');
    generatePix.disabled = true;
    if (note) note.textContent = 'Gerando a cobrança Pix…';
    try {
      const result = await apiRequest(`/api/store/orders/${encodeURIComponent(card.dataset.orderId)}/payment`, { method: 'POST', body: '{}' });
      localStorage.setItem('rynex-last-order', JSON.stringify(result.order));
      localStorage.setItem(`rynex-payment-${result.order.id}`, JSON.stringify(result.payment));
      window.location.reload();
    } catch (error) { if (note) note.textContent = error.message; generatePix.disabled = false; }
    return;
  }
  const copyOrderLink = event.target.closest('[data-copy-order-link]');
  if (copyOrderLink) {
    const text = copyOrderLink.dataset.copyOrderLink;
    try { await navigator.clipboard.writeText(text); copyOrderLink.textContent = 'Link copiado'; }
    catch (_) { const area = document.createElement('textarea'); area.value = text; document.body.append(area); area.select(); document.execCommand('copy'); area.remove(); copyOrderLink.textContent = 'Link copiado'; }
    setTimeout(() => { copyOrderLink.textContent = 'Copiar link do pedido'; }, 1800);
    return;
  }
  const copyPix = event.target.closest('[data-copy-pix]');
  if (copyPix) {
    const code = $('#pix-copy-code');
    if (code?.value) {
      const done = () => { copyPix.textContent = 'Código copiado'; setTimeout(() => { copyPix.textContent = 'Copiar código Pix'; }, 1800); };
      if (navigator.clipboard?.writeText) navigator.clipboard.writeText(code.value).then(done).catch(() => { code.select(); document.execCommand('copy'); done(); });
      else { code.select(); document.execCommand('copy'); done(); }
    }
    return;
  }
  const add = event.target.closest('[data-add]'); if (add) { event.preventDefault(); event.stopPropagation(); addToCart(add.dataset.add); return; }
  const qty = event.target.closest('[data-quantity]'); if (qty) { changeCart(qty.dataset.quantity, Number(qty.dataset.change)); return; }
  const remove = event.target.closest('[data-remove]'); if (remove) { cart = cart.filter(item => String(item.product.id) !== String(remove.dataset.remove)); saveCart(); renderCartDrawer(); if (currentPath === '/cart') window.location.reload(); return; }
  if (event.target.closest('[data-open-cart]')) document.body.classList.add('cart-open');
  if (event.target.closest('[data-close-cart]')) document.body.classList.remove('cart-open');
  if (event.target.closest('[data-menu]')) $('.main-nav').classList.toggle('menu-open');
  const filter = event.target.closest('[data-filter]'); if (filter) { filterCatalog(filter.dataset.filter); }
  if (event.target.closest('[data-clear-search]')) { if ($('#search')) $('#search').value = ''; filterCatalog('All'); }
  if (event.target.closest('[data-checkout]')) { window.location.href = route('/cart'); return; }
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
const loadAccountOrders = async () => {
  const list = $('#account-orders-list');
  if (!list) return;
  try {
    const { orders = [] } = await apiRequest('/api/store/orders');
    if (!orders.length) {
      list.innerHTML = `<article class="auth-card order-history-card order-history-empty"><span class="section-kicker"><i></i> Nenhum pedido ainda</span><h2>Seu primeiro drop começa aqui.</h2><p>Quando você fizer uma compra, o pedido e o atendimento aparecem nesta página.</p><a class="button button-light" href="${route('/shop')}">Explorar produtos ${icon('arrow', 16)}</a></article>`;
      return;
    }
    const labels = { awaiting_payment: 'Aguardando pagamento', paid: 'Pagamento confirmado', awaiting_delivery: 'Aguardando entrega', payment_rejected: 'Pagamento recusado', delivered: 'Entregue' };
    list.innerHTML = orders.map(order => {
      const items = (order.items || []).map(item => `${Number(item.quantity) || 1}× ${escapeHtml(item.name || 'Produto')}`).join(' · ');
      const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString('pt-BR') : '';
      return `<article class="auth-card order-history-card"><div class="order-history-head"><div><span class="eyebrow">Pedido</span><h2>${escapeHtml(order.id)}</h2></div><span class="order-status">${escapeHtml(labels[order.status] || 'Em andamento')}</span></div><p class="order-history-items">${items}</p><div class="order-history-foot"><strong>${money(Number(order.total) || 0)}</strong><a class="button button-outline" href="${escapeHtml(orderTrackingUrl(order.id))}">Abrir pedido ${icon('arrow', 15)}</a></div><time>${escapeHtml(date)}</time></article>`;
    }).join('');
  } catch (error) {
    list.innerHTML = `<article class="auth-card order-history-card"><p class="auth-note">${escapeHtml(error.message)}</p></article>`;
  }
};
loadAccountOrders();
const compressProfileImage = async file => {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Escolha uma imagem PNG, JPG ou WEBP.');
  if (file.size > 10 * 1024 * 1024) throw new Error('A imagem original precisa ter até 10 MB.');
  const image = await createImageBitmap(file);
  try {
    for (const maxSide of [320, 256, 192]) {
      const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext('2d', { alpha: false }).drawImage(image, 0, 0, canvas.width, canvas.height);
      for (const quality of [0.82, 0.7, 0.58, 0.48]) {
        let dataUrl = canvas.toDataURL('image/webp', quality);
        if (!dataUrl.startsWith('data:image/webp;base64,')) dataUrl = canvas.toDataURL('image/jpeg', quality);
        const encoded = dataUrl.slice(dataUrl.indexOf(',') + 1);
        if (Math.ceil(encoded.length * 3 / 4) <= 180 * 1024) return dataUrl;
      }
    }
  } finally { image.close?.(); }
  throw new Error('Não foi possível comprimir a foto para menos de 180 KB. Escolha outra imagem.');
};
const linkedOrderToLoad = new URLSearchParams(window.location.search).get('order');
if (linkedOrderToLoad && getLastOrder()?.id !== linkedOrderToLoad) {
  apiRequest(`/api/store/orders/${encodeURIComponent(linkedOrderToLoad)}`).then(({ order }) => {
    if (!order) throw new Error('Pedido não encontrado.');
    localStorage.setItem('rynex-last-order', JSON.stringify(order));
    if (order.payment) localStorage.setItem(`rynex-payment-${order.id}`, JSON.stringify(order.payment));
    const container = $('#linked-order-content');
    if (container) container.outerHTML = orderChatPanel(order);
    refreshOrderChat();
  }).catch(error => {
    const container = $('#linked-order-content');
    if (!container) return;
    const returnPath = `/?order=${encodeURIComponent(linkedOrderToLoad)}`;
    const loginUrl = `${route('/login')}?return=${encodeURIComponent(returnPath)}`;
    container.innerHTML = `<div class="order-chat-card"><p class="order-note">${escapeHtml(error.message)} Entre na conta usada para fazer este pedido para ver os detalhes.</p><a class="button button-light" href="${escapeHtml(loginUrl)}">Entrar e abrir pedido ${icon('arrow', 16)}</a></div>`;
  });
}
const showAuthNote = (id, message, success = false) => { const node = document.querySelector(id); if (node) { node.textContent = message; node.classList.toggle('success', success); } };
$('#login-form')?.addEventListener('submit', async event => {
  event.preventDefault();
  const form = new FormData(event.target);
  showAuthNote('#login-note', 'Conectando...');
  try { const result = await apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: form.get('email'), password: form.get('password') }) }); localStorage.setItem(SESSION_KEY, JSON.stringify(result)); adoptGuestCart(); const next = new URLSearchParams(window.location.search).get('return') || '/cart'; window.location.href = route(next); }
  catch (error) { showAuthNote('#login-note', error.message); }
});
$('#register-form')?.addEventListener('submit', async event => {
  event.preventDefault();
  const form = new FormData(event.target);
  showAuthNote('#register-note', 'Criando sua conta...');
  try { const result = await apiRequest('/api/auth/register', { method: 'POST', body: JSON.stringify({ name: form.get('name'), username: form.get('username'), email: form.get('email'), password: form.get('password') }) }); localStorage.setItem(SESSION_KEY, JSON.stringify(result)); adoptGuestCart(); const next = new URLSearchParams(window.location.search).get('return') || '/cart'; window.location.href = route(next); }
  catch (error) {
    const message = error instanceof TypeError && /fetch/i.test(error.message)
      ? 'A conexão caiu antes da confirmação. Sua conta pode já ter sido criada; tente entrar antes de cadastrar novamente.'
      : error.message;
    showAuthNote('#register-note', message);
  }
});
$('#avatar-file')?.addEventListener('change', async event => {
  const file = event.target.files?.[0];
  if (!file) return;
  showAuthNote('#avatar-note', 'Preparando sua foto…');
  try {
    profileAvatarDraft = await compressProfileImage(file);
    const user = getSession()?.user || {};
    $('#avatar-preview').innerHTML = avatarMarkup({ ...user, avatar: profileAvatarDraft }, 'profile-avatar-image');
    showAuthNote('#avatar-note', 'Foto pronta. Salve as alterações para aplicá-la à conta.', true);
  } catch (error) {
    showAuthNote('#avatar-note', error.message);
    event.target.value = '';
  }
});
$('#remove-avatar')?.addEventListener('click', () => {
  profileAvatarDraft = null;
  $('#avatar-file').value = '';
  const user = getSession()?.user || {};
  $('#avatar-preview').innerHTML = avatarMarkup({ ...user, avatar: null }, 'profile-avatar-image');
  showAuthNote('#avatar-note', 'A foto será removida quando você salvar as alterações.', true);
});
$('#profile-form')?.addEventListener('submit', async event => {
  event.preventDefault();
  const form = new FormData(event.target);
  const note = $('#profile-note');
  const button = event.target.querySelector('button[type="submit"]');
  if (button) button.disabled = true;
  showAuthNote('#profile-note', 'Salvando seus dados...');
  try {
    const result = await apiRequest('/api/auth/profile', { method: 'PUT', body: JSON.stringify({ name: form.get('name'), username: form.get('username'), email: form.get('email'), avatar: profileAvatarDraft }) });
    localStorage.setItem(SESSION_KEY, JSON.stringify({ ...getSession(), user: result.user }));
    profileAvatarDraft = result.user.avatar || null;
    const avatarPreview = $('#avatar-preview');
    if (avatarPreview) avatarPreview.innerHTML = avatarMarkup(result.user, 'profile-avatar-image');
    const loginLink = $('.login-button');
    if (loginLink) loginLink.innerHTML = `${avatarMarkup(result.user, 'header-avatar')}<span>Minha conta</span>`;
    showAuthNote('#profile-note', 'Conta atualizada com sucesso.', true);
    const heading = document.querySelector('.auth-card h2');
    if (heading) heading.textContent = `Olá, ${result.user.name}.`;
  } catch (error) { showAuthNote('#profile-note', error.message); }
  finally { if (button) button.disabled = false; }
});
$('#change-password-form')?.addEventListener('submit', async event => {
  event.preventDefault();
  const form = new FormData(event.target);
  const newPassword = String(form.get('newPassword') || '');
  const confirmPassword = String(form.get('confirmPassword') || '');
  if (newPassword !== confirmPassword) { showAuthNote('#settings-note', 'A confirmação da nova senha não corresponde.'); return; }
  const account = getSession()?.user;
  if (!account) { showAuthNote('#settings-note', 'Entre novamente para alterar sua senha.'); return; }
  const button = event.target.querySelector('button[type="submit"]');
  if (button) button.disabled = true;
  showAuthNote('#settings-note', 'Atualizando sua senha...');
  try {
    const result = await apiRequest('/api/auth/profile', { method: 'PUT', body: JSON.stringify({ name: account.name, username: account.username, email: account.email, currentPassword: form.get('currentPassword'), newPassword }) });
    localStorage.setItem(SESSION_KEY, JSON.stringify({ ...getSession(), user: result.user }));
    event.target.reset();
    showAuthNote('#settings-note', 'Senha atualizada com sucesso.', true);
  } catch (error) { showAuthNote('#settings-note', error.message); }
  finally { if (button) button.disabled = false; }
});
$('#logout-button')?.addEventListener('click', async () => {
  try { await apiRequest('/api/auth/logout', { method: 'POST', body: '{}' }); }
  catch (_) {}
  localStorage.removeItem(cartStorageKey());
  localStorage.removeItem(GUEST_CART_KEY);
  localStorage.removeItem(LEGACY_CART_KEY);
  localStorage.removeItem('rynex-last-order');
  for (const key of Object.keys(localStorage)) if (key.startsWith('rynex-payment-')) localStorage.removeItem(key);
  localStorage.removeItem(SESSION_KEY);
  cart = [];
  window.location.href = route('/');
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
    window.location.href = orderTrackingUrl(result.order.id);
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
document.addEventListener('submit', async event => {
  if (event.target.id !== 'order-message-form') return;
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
refreshOrderChat();
window.setInterval(refreshOrderChat, 4000);
$('[data-focus-search]')?.addEventListener('click', () => { if (currentPath !== '/shop') window.location.href = route('/shop'); else $('#search')?.focus(); });
$('#newsletter')?.addEventListener('submit', event => { event.preventDefault(); $('#newsletter-note').textContent = 'Sinal captado. Você será o primeiro a saber do próximo drop.'; $('#newsletter-note').classList.add('success'); event.target.reset(); });
$('#contact-form')?.addEventListener('submit', event => { event.preventDefault(); $('#contact-note').textContent = 'Mensagem recebida. Voltamos em breve.'; $('#contact-note').classList.add('success'); event.target.reset(); });
document.addEventListener('mousemove', event => { document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`); document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`); });
document.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); if (currentPath !== '/shop') window.location.href = route('/shop'); else $('#search')?.focus(); } if (event.key === 'Escape') document.body.classList.remove('cart-open'); });
if (currentPath === '/shop') { const params = new URLSearchParams(window.location.search); const category = params.get('category'); if (category) filterCatalog(category); }
