# Projeto Catalogo de Cestas Online

## Objetivo

Preciso de uma aplicação online que seja um catálogo navegável para as Cestas de Café da Manhã, Tábuas de Frios, entre outros produtos do tipo. Essa aplicação deve estar disponível online, deve ter uma área de administrador que seja acessível via login, na qual seja possível cadastrar, excluir, alterar e enriquecer os cadastros dos produtos. O catálogo deve apresentar a imagem, descrição e valor dos itens, deve ter uma visualização dos itens na qual mostra as informações completas e ter um link que leve para o WhatsApp para finalizar a venda informando o produto na mensagem.

## Linguagens e Estrutura

Devemos separar os códigos de cliente e servidor e manter boas praticas de codificação, separação de conceitos e estruturas de mercado.

Como estrutura de linguagem devemos usar Typescript, HTML e CSS. Usar LIT para criação dos componentes de cliente. 



## Casos de Uso (Use Cases)

### Ator: Cliente (Foco em Mobile-First)

- UC01: Visualizar Catálogo Geral: O cliente acessa a aplicação (otimizada para dispositivos móveis) e visualiza a listagem de produtos ativos. A interface exibe a imagem (via link fornecido), título, categoria e preço resumido.

- UC02: Buscar Produtos por Texto: O cliente utiliza uma barra de pesquisa na interface para filtrar os produtos dinamicamente por nome ou palavras-chave da descrição.

- UC03: Filtrar por Categorias: O cliente seleciona uma categoria específica (ex: "Cestas de Café da Manhã", "Tábuas de Frios") através de abas ou menu de filtros para refinar a listagem do catálogo.

- UC04: Visualizar Detalhes do Produto: O cliente clica em um item e acessa a página de detalhes (carregada com tags de SEO/OpenGraph). Exibe a imagem completa, descrição detalhada, preço e itens inclusos. Produtos inativos não podem ser acessados por esta rota.

- UC05: Iniciar Compra (Checkout WhatsApp): Na página do produto, o cliente clica no botão de compra. O sistema dispara a API do WhatsApp utilizando o número configurado dinamicamente no painel administrativo, preenchendo a mensagem com os dados do item.

Ator: Administrador

- UC06: Autenticar no Sistema (Firebase): O administrador realiza login na área restrita utilizando as credenciais gerenciadas pelo Firebase Authentication.

- UC07: Configurar WhatsApp da Loja: O administrador acessa uma tela de configurações gerais para definir ou atualizar o número de telefone (com DDD) que receberá as mensagens de vendas.

- UC08: Gerenciar Categorias: O administrador pode cadastrar, editar ou remover as categorias que organizam o catálogo (ex: criar a categoria "Especiais de Dia dos Namorados").

- UC09: Cadastrar Produto: O admin insere um novo item informando título, descrição, preço, seleciona uma categoria cadastrada, define o status inicial (Ativo/Inativo) e insere o link (URL) da imagem hospedada externamente.

- UC10: Editar/Enriquecer Produto (Controle de Visibilidade): O admin altera os dados do produto, incluindo a funcionalidade de Ativar/Inativar o item através de um toggle (chave liga/desliga), controlando instantaneamente a exibição no catálogo sem precisar deletar o registro.

- UC11: Excluir Produto: O admin remove definitivamente o produto da base de dados.

### Alinhamento Arquitetural e Requisitos Técnicos

Com as definições de infraestrutura refinadas, o escopo técnico ganha contornos mais claros para o desenvolvimento:
Autenticação e Segurança (Firebase)

    Firebase Auth: Toda a proteção das rotas administrativas (/admin/*) será delegada ao Firebase. O controle de sessão pode ser validado no lado do servidor (caso use frameworks como Next.js/Nuxt.js) ou via Route Guards no lado do cliente, garantindo que apenas usuários autenticados invoquem as funções de mutação de dados.

Modelo de Dados Simplificado para Imagens

    Imagens por URL: Como as imagens serão salvas por meio de links externos, o banco de dados armazenará apenas uma string com a URL do arquivo (ex: links do Imgur, Postimages ou de um servidor próprio).

    Ponto de atenção: No cadastro do admin, é recomendável implementar uma validação simples para garantir que o link inserido é uma URL válida e, se possível, renderizar um preview da imagem na tela de cadastro para evitar erros de digitação.

SEO & OpenGraph (Compartilhamento Social)

    Meta-tags Dinâmicas: A rota de detalhes do produto (ex: /produto/tahua-premium) deve injetar dinamicamente no <head> do HTML as tags necessárias para indexação e compartilhamento social:

        og:title: Nome do Produto + Nome da Loja.

        og:description: Resumo da descrição do produto.

        og:image: O link da imagem que foi cadastrado no painel.

        og:url: O link definitivo daquela página.

    Para que o robô do WhatsApp ou do Google consiga ler essas tags antes de renderizar a página, a aplicação se beneficiará fortemente de estratégias de SSR (Server-Side Rendering) ou SSG (Static Site Generation) com revalidação sob demanda.

Interface Mobile-First

    Design Responsivo Avançado: O layout deve ser desenhado focado na experiência de toque, com botões de ação (como o de comprar) sempre acessíveis ao polegar, navegação fluida por categorias (ex: rolagem horizontal de categorias no topo) e carregamento rápido de imagens para redes móveis (3G/4G/5G).
