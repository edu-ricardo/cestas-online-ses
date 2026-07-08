# Regras do Projeto (cestas-online-ses)

As regras abaixo devem ser estritamente seguidas por todos os agentes de IA ao interagir com este repositório.

## 1. Verificação Contínua de Build (Compilação)
- **Sempre execute** `npm run build` (via terminal) logo após concluir alterações em arquivos de código fonte, especialmente em arquivos TypeScript (`.ts`).
- Se a compilação falhar com erros (ex: `TS1127`, erros de tipagem, assinaturas de classe conflitantes), você **DEVE** investigar e resolver os erros imediatamente antes de dar o trabalho como finalizado para o usuário.
- Inclua o passo de "Verificar compilação via `npm run build`" na etapa de *Verification Plan* ao propor mudanças estruturais.

## 2. Boas Práticas e Clean Code
- **Evite o uso de `any`**: TypeScript deve ser usado de forma estrita. Sempre crie ou reuse `interfaces` para os modelos de dados.
- **Nomes Significativos**: Use nomes descritivos e auto-explicativos para funções, variáveis e componentes.
- **Evite "Magic Numbers/Strings"**: Extraia valores fixos para constantes ou variáveis CSS adequadas.

## 3. Separação de Conceitos (Separation of Concerns)
- **Serviços de Dados Isolados**: Toda a comunicação com Firebase (Firestore, Auth, Storage) deve residir no diretório `src/services/` (ex: `data-service.ts`, `settings-service.ts`). Os componentes visuais (no diretório `src/components/` ou `src/pages/`) nunca devem importar diretamente métodos do Firebase Firestore (`addDoc`, `getDocs`, etc.). 
- **Componentes Focados**: Cada componente Lit (`LitElement`) deve ter apenas uma responsabilidade visual/lógica de interface. Se um componente estiver crescendo muito, separe sua lógica visual em sub-componentes.

## 4. Estilização e UI Premium
- O projeto adota um Design System próprio definido em `src/index.css`.
- **NUNCA** utilize cores em *hardcode* (como `#fff`, `#000`, `#ccc`) ou propriedades de background e textos absolutas que não reagem a temas.
- **SEMPRE** utilize as Variáveis CSS globais do projeto: `var(--bg-surface)`, `var(--bg-main)`, `var(--text-primary)`, `var(--text-secondary)`, `var(--text-muted)`, `var(--primary-color)`, `var(--border-color)`, etc. Isso garante que o Modo Escuro (`data-theme="dark"`) funcione de forma automática e perfeita.
