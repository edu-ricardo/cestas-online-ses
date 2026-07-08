# Cestas Online - Catálogo Digital

## 📖 Sobre o Projeto
O **Cestas Online** é uma aplicação web focada em servir como um catálogo digital navegável para produtos como Cestas de Café da Manhã e Tábuas de Frios. Com foco principal na experiência **Mobile-First**, a aplicação permite que os clientes visualizem produtos, filtrem por categorias e enviem pedidos diretamente via **WhatsApp**. 

Além da vitrine pública, o sistema conta com uma **Área Administrativa** protegida, onde o lojista pode gerenciar os produtos, categorias e as configurações da loja de forma dinâmica.

## 🛠️ Stack Tecnológica
- **Frontend (Cliente & Admin):** [Vite](https://vitejs.dev/) + [Lit](https://lit.dev/) (Web Components), TypeScript, HTML e CSS (Single Page Application - SPA).
- **Backend & Infraestrutura (BaaS):** [Firebase](https://firebase.google.com/)
  - **Firebase Auth:** Autenticação e proteção de rotas administrativas.
  - **Firestore Database:** Banco de dados NoSQL (Categorias, Produtos, Configurações).
  - **Firebase Cloud Functions:** Renderização dinâmica (Server-Side) de meta tags (OpenGraph/SEO) para compartilhamento rico em redes sociais e WhatsApp.
  - **Firebase Hosting:** Hospedagem da aplicação.

## ⚙️ Arquitetura e Funcionalidades Principais
- **Catálogo Público Mobile-First:** Interface responsiva focada em dispositivos móveis, com busca textual e filtros por categorias.
- **Integração com WhatsApp:** Geração dinâmica de links de checkout enviando os detalhes do produto diretamente para o número configurado pela loja.
- **SEO & OpenGraph Dinâmico:** Uso de Cloud Functions para injetar meta tags dinâmicas antes do carregamento do SPA, garantindo que o WhatsApp e outras redes leiam as imagens e descrições corretamente ao compartilhar o link do produto.
- **Painel Administrativo:** CRUD completo de produtos e categorias, com controle de visibilidade (Ativo/Inativo) e atualização em tempo real sem necessidade de recarregar a página.

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js instalado.
- Conta no Firebase com projeto configurado (Auth, Firestore, Functions habilitados).

### Instalação
1. Clone este repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente baseadas no `.env.example`.
4. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Para build de produção:
   ```bash
   npm run build
   ```

## 💡 Pontos de Melhoria Identificados (Oportunidades Futuras)
Durante a análise da arquitetura e dos requisitos do projeto, levantamos algumas oportunidades de evolução para tornar a plataforma mais robusta e escalável:

1. **Gestão de Imagens (Firebase Storage):**
   - *Atual:* O sistema depende de URLs externas (ex: Imgur) inseridas manualmente.
   - *Melhoria:* Integrar o **Firebase Storage** no painel administrativo para permitir o upload direto de imagens. Isso garante maior controle, evita links quebrados e possibilita redimensionamento/otimização automática das imagens.

2. **Carrinho de Compras (Múltiplos Itens):**
   - *Atual:* A compra é iniciada por item, enviando um produto por vez para o WhatsApp.
   - *Melhoria:* Implementar um sistema de carrinho (usando LocalStorage ou State Management) permitindo que o cliente selecione múltiplos produtos e envie um único pedido consolidado via WhatsApp.

3. **Progressive Web App (PWA):**
   - Transformar a aplicação em um PWA adicionando *Service Workers* e um arquivo *manifest.json*. Isso permitirá que os usuários "instalem" o catálogo na tela inicial do celular, oferecendo uma experiência mais nativa e carregamento offline/cacheado.

4. **Testes Automatizados:**
   - *Atual:* Planejamento focado em testes manuais.
   - *Melhoria:* Introduzir testes unitários (ex: **Vitest**) para os componentes Lit e regras de negócio, além de testes E2E (ex: **Cypress** ou **Playwright**) para garantir o funcionamento do fluxo de compra e área administrativa.

5. **Gerenciamento de Estado Global:**
   - Conforme a aplicação crescer (ex: adição de carrinho, temas, dados do usuário autenticado), adotar uma solução de gerenciamento de estado global para evitar a passagem excessiva de propriedades (*prop-drilling*) entre os Web Components.

6. **Analytics e Métricas de Conversão:**
   - Integrar o **Google Analytics para Firebase** para rastrear os produtos mais acessados, cliques no botão de WhatsApp e origens de tráfego, auxiliando o lojista em tomadas de decisão estratégicas.
