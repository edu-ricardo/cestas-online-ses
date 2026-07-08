# Plano de Desenvolvimento: Catálogo de Cestas Online

## 1. Background & Motivação
A aplicação será um catálogo online focado no segmento de cestas de café da manhã e tábuas de frios. O objetivo é fornecer uma experiência de visualização mobile-first para clientes finais e uma área administrativa segura para o gerenciamento do catálogo, categorias e configurações da loja, com o fechamento de pedidos direcionado diretamente para o WhatsApp.

## 2. Escopo do Projeto
O escopo abrange o desenvolvimento completo da aplicação "Cestas Online", contemplando:
- **Frontend Público:** Catálogo de produtos, busca, filtros e detalhes do produto (otimizado para SEO/WhatsApp).
- **Frontend Administrativo:** Login seguro, dashboard, CRUD de produtos (com controle de visibilidade ativo/inativo), CRUD de categorias e configuração do número de WhatsApp.
- **Backend/Infraestrutura:** Banco de dados NoSQL, autenticação de usuários e funções serverless para lidar com os metadados dinâmicos (OpenGraph) necessários para links compartilhados em redes sociais e WhatsApp.

## 3. Arquitetura e Stack Tecnológica (Aprovada)
- **Frontend Cliente/Admin:** Vite + Lit (Web Components) com TypeScript, HTML e CSS. Abordagem SPA (Single Page Application).
- **Backend (BaaS):** Firebase.
  - **Firebase Auth:** Gerenciamento de sessão e proteção de rotas administrativas.
  - **Firestore Database:** Banco de dados NoSQL para armazenar categorias, produtos e configurações.
  - **Firebase Hosting:** Hospedagem estática da SPA.
- **Estratégia SEO/OpenGraph:** **Firebase Cloud Functions**. As requisições para a rota `/produto/:id` serão interceptadas por uma Function que buscará os dados no Firestore, injetará as meta tags (og:title, og:image, etc.) no HTML base e retornará a página para o cliente, garantindo a leitura por bots do WhatsApp/Google antes do carregamento do Lit SPA.

## 4. Modelo de Dados (Firestore)
- **`settings` (Coleção):**
  - Documento `store_config`: `{ whatsappNumber: "5511999999999" }`
- **`categories` (Coleção):**
  - Documento: `{ id: "cat1", name: "Cestas de Café da Manhã" }`
- **`products` (Coleção):**
  - Documento: `{ id: "prod1", title: "Cesta Premium", description: "Descrição detalhada...", price: 150.00, categoryId: "cat1", imageUrl: "https://imgur.com/.../img.png", isActive: true, createdAt: Timestamp }`

## 5. Fases de Implementação

### Fase 1: Setup Inicial do Projeto
- Inicialização do projeto usando Vite com template Lit (TypeScript).
- Configuração de linting e formatação (ESLint/Prettier).
- Criação do projeto no Firebase Console (Auth, Firestore, Functions, Hosting).
- Configuração do Firebase SDK no projeto web.

### Fase 2: Autenticação e Rotas Base
- Implementação de roteamento client-side (ex: `@lit-labs/router` ou `vaadin/router`).
- Criação das telas de Login do Admin.
- Integração com Firebase Auth.
- Implementação de Route Guards para proteger rotas `/admin/*`.

### Fase 3: Área Administrativa (Admin)
- Criação do layout do painel administrativo.
- Implementação da tela de Configuração (Salvar/Editar número de WhatsApp no Firestore).
- Implementação do CRUD de Categorias (Listar, Criar, Editar, Excluir).
- Implementação do CRUD de Produtos:
  - Formulário com campos de texto, preço, select de categoria, input de URL para imagem.
  - Toggle switch para Ativar/Inativar (Controle de Visibilidade).

### Fase 4: Catálogo Público
- Desenvolvimento do Layout Base Mobile-First (Header, Footer, Área de Conteúdo).
- Tela Inicial (Listagem Geral de Produtos Ativos).
- Funcionalidade de Busca por Texto (Filtragem client-side ou consultas Firestore otimizadas).
- Funcionalidade de Filtro por Categorias.

### Fase 5: Detalhes do Produto e SEO (Cloud Functions)
- Criação da página de Detalhes do Produto no Lit.
- Implementação da Firebase Cloud Function para renderização dinâmica (Server-Side) das tags OpenGraph.
- Configuração do `firebase.json` para reescrever (rewrite) rotas `/produto/*` para a Cloud Function.

### Fase 6: Integração de Checkout (WhatsApp)
- Desenvolvimento do botão de "Comprar" na página de detalhes.
- Lógica para buscar o número de WhatsApp configurado (cache local ou estado global).
- Formatação da mensagem (ex: "Olá, gostaria de encomendar o produto: [Título do Produto] no valor de R$ [Valor]").
- Geração do link `https://wa.me/...` e redirecionamento do usuário.

## 6. Validação e Testes
- Testes manuais do fluxo do cliente (mobile e desktop).
- Testes manuais do fluxo administrativo (permissões, CRUD).
- Validação das meta tags usando ferramentas como Facebook Sharing Debugger e testes práticos via WhatsApp.

## 7. Deploy
- Build da aplicação web.
- Deploy do frontend e backend via Firebase CLI (`firebase deploy`).
