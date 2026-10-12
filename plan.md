# Modernização visual — E Rynex

## Direção

**Movimento:** editorial futurista premium, misturando direção de arte de fashion e-commerce com interfaces de produto digital.

**Princípios:** contraste controlado, composição com respiro, superfícies translúcidas usadas com parcimônia e microinterações que dão sensação de produto acabado.

**Cor:** manter o violeta elétrico e o ciano como assinatura da E Rynex, apoiados por preto grafite e branco frio. O fundo deixa de ser apenas escuro e passa a usar halos radiais sutis para criar profundidade sem ruído.

**Layout:** manter a estrutura editorial assimétrica do hero e das páginas, reforçando contêineres amplos, cards com bordas suaves e uma navegação mais leve.

**Elementos assinatura:** glow orbital do hero, tags técnicas em mono e cartões de produto com moldura interna.

**Interação:** hover curto e responsivo, foco visível, botões com elevação discreta e feedback de compra preservado.

**Tipografia:** Space Grotesk para títulos de impacto, DM Sans para leitura e DM Mono para metadados técnicos.

**Essência da marca:** objetos e roupas para pessoas que querem se mover fora do óbvio — precisos, experimentais e confiantes.

## Implementação

- Preservar as rotas, o catálogo, filtros, busca, carrinho persistido e checkout demonstrativo.
- Refinar a camada visual em `src/styles.css` com tokens, estados de foco, responsividade e profundidade.
- Manter assets oficiais existentes e o manifesto de rotas.
- Validar com build de produção e smoke test HTTP do Vite.
- Em Minha conta, permitir escolher, pré-visualizar, substituir e remover uma foto; o navegador reduz a imagem e a API valida formato e tamanho antes de persistir no perfil.
- No checkout, criar o pedido e gerar automaticamente QR Pix estático e código copia-e-cola pelo mesmo gerador usado em `/gerarpix`; persistir a cobrança no pedido e permitir regenerá-la após a configuração da chave.
- Fornecer link de acompanhamento do pedido com autorização da conta. Pix estático não produz URL universal de pagamento nem confirma o crédito automaticamente; a confirmação continua manual no bot.

## Estrutura

- `src/main.js`: composição das páginas, dados do catálogo e interações.
- `src/styles.css`: sistema visual, layout, responsividade e animações.
- `public/`: logos e manifesto de rotas.
- `index.html` / `app.config.ts`: entrada, SEO básico e branding do projeto.
