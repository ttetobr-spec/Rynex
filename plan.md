# Rynex — loja, pedidos e atendimento integrado

## Direção

**Movimento:** editorial futurista premium, misturando e-commerce de moda com uma interface operacional limpa para pedidos e suporte.

**Princípios:** contraste controlado, composição com respiro, superfícies translúcidas usadas com parcimônia e feedback claro em cada etapa de compra.

**Cor:** manter violeta elétrico, ciano, preto grafite e branco frio como assinatura da E Rynex/Rynex.

**Layout:** preservar o storefront existente e adicionar telas de conta e checkout sem transformar a home em um painel administrativo.

**Elementos assinatura:** glow orbital, tags técnicas em mono, cartões de produto com moldura interna e status de pedido em chips.

**Interação:** hover curto, foco visível, formulários objetivos, cupom aplicado antes do pedido e atualização de mensagens por polling.

**Tipografia:** Space Grotesk para títulos, DM Sans para leitura e DM Mono para metadados técnicos.

**Essência da marca:** objetos e roupas para pessoas que querem se mover fora do óbvio — precisos, experimentais e confiantes.

## Escopo implementado nesta fase

- Comandos administrativos do bot para adicionar, editar, listar e remover produtos com nome, preço, categoria, imagem, URL e descrição.
- Comandos do bot para configurar categorias, textos básicos do site, cupom e aceite/recusa manual de pedidos.
- API no bot para catálogo público, cadastro/login com e-mail e senha armazenada com scrypt, criação de pedidos e mensagens.
- Cupom configurável com 100% de desconto para teste; o pedido zerado entra como pago e abre o canal privado de entrega.
- Pedidos pagos com valor maior que zero ficam aguardando a confirmação manual do pagamento via Pix até a chave real ser configurada.
- Canal Discord privado por pedido, com acesso ao cargo administrativo e, quando informado, ao ID Discord do cliente.
- Sincronização de chat: mensagens do site são enviadas pelo bot ao canal Discord e mensagens do canal ficam disponíveis para o site.
- Frontend mantém fallback demonstrativo quando a API não estiver online; o checkout não finge um pagamento real.

## Estrutura

- `src/main.js`: storefront, carregamento do catálogo da API, login, checkout, cupom e acesso a pedidos.
- `src/styles.css`: sistema visual atual e estilos das telas de conta/checkout.
- `public/manus-routes.json`: rotas públicas e de conta.
- `../rynex-bot/index.js`: cliente Discord, tickets existentes e inicialização HTTP.
- `../rynex-bot/store.js`: catálogo, autenticação, pedidos, cupom, canais privados e chat site↔Discord.
- `../rynex-bot/data/`: estado local do bot, ignorado pelo Git; em hospedagem persistente deve usar volume/dados duráveis.

## Integração e segredos

- `DISCORD_TOKEN`, `ADMIN_PANEL_KEY`, `BOT_INTERNAL_KEY` e `PIX_KEY` ficam somente no ambiente do bot.
- O checkout atual usa Pix manual; integração automática com Stripe/Mercado Pago fica separada para a próxima etapa, porque o provedor/chave ainda não foi escolhido.
- O cupom de teste padrão é `RYNEX-TEST`, configurável pelo bot e nunca exposto no catálogo público.
- O site usa `/api` relativo em desenvolvimento; o Vite faz proxy para a API do bot.
