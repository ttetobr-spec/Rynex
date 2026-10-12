- [x] Corrigir o GitHub Pages para suportar links internos usando base de assets e fallback 404.html.
- [x] Em Minha conta, escolher, pré-visualizar, substituir ou remover uma foto; comprimir no navegador, validar no servidor, salvar no perfil e mostrar no cabeçalho.
- [x] Ao criar pedido pago, gerar QR Pix estático e copia-e-cola pelo mesmo gerador do `/gerarpix`; salvar e exibir a cobrança no acompanhamento do pedido.
- [x] Manter confirmação manual: Pix estático não confirma recebimento nem fornece URL universal de pagamento; o canal só é aberto após confirmação administrativa.
- [x] Separar login, cadastro, Minha conta e Configurações em páginas próprias; manter o carrinho e criar uma página própria de Meus pedidos.
- [x] Em Configurações, permitir trocar a senha com senha atual, nova senha e confirmação; permitir sair e invalidar a sessão atual.
- [x] Criar histórico privado em `/orders`, limitado aos pedidos da conta autenticada; links abrem o pedido e sua cobrança Pix.
- [x] Separar o carrinho de convidado por conta; preservar itens de convidado ao entrar, limpar o carrinho ativo ao sair e não mostrar itens de uma conta para outra.
- [x] Manter `/cart` para a compra atual, sem substituir a página por um pedido anterior; pedidos pendentes ficam em `/orders` e não bloqueiam novos pedidos.
- [x] Fazer o botão de checkout do carrinho lateral abrir o checkout real, não uma mensagem demonstrativa.
- [x] Após a separação das páginas, salvar perfil sem erros de campos de senha inexistentes.

Nota: recuperação de senha esquecida por e-mail ainda depende de configurar um serviço seguro de envio; a troca de senha autenticada está implementada.
