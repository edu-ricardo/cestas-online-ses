import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

@customElement('admin-dashboard')
export class AdminDashboard extends LitElement {
  @state() private loading = true;
  @state() private user: any = null;

  connectedCallback() {
    super.connectedCallback();
    onAuthStateChanged(auth, (user) => {
      this.user = user;
      this.loading = false;
      if (!user) {
        window.location.href = '/admin';
      }
    });
  }

  static styles = css`
    :host {
      display: block;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
    }
    h1 {
      margin: 0;
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.025em;
    }
    .user-info {
      color: var(--text-secondary);
      margin-top: 0.5rem;
      font-size: 0.95rem;
    }
    button.logout {
      padding: 0.75rem 1.5rem;
      background: var(--danger-color);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    button.logout:hover {
      background: var(--danger-hover);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
    }
    .card {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 2.5rem;
      text-decoration: none;
      color: inherit;
      box-shadow: var(--shadow-sm);
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      position: relative;
      overflow: hidden;
    }
    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: var(--primary-color);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s ease;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-md);
      border-color: var(--primary-color);
    }
    .card:hover::before {
      transform: scaleX(1);
    }
    .card h2 {
      margin: 0 0 1rem 0;
      color: var(--text-primary);
      font-size: 1.5rem;
      font-weight: 600;
    }
    .card p {
      margin: 0;
      color: var(--text-muted);
      line-height: 1.6;
    }
    .icon {
      width: 56px;
      height: 56px;
      background: rgba(99, 102, 241, 0.1);
      color: var(--primary-color);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2rem;
    }
    .icon svg {
      width: 28px;
      height: 28px;
      fill: currentColor;
    }
  `;

  async handleLogout() {
    await signOut(auth);
    window.location.href = '/admin';
  }

  render() {
    if (this.loading) return html`<div style="text-align: center; padding: 3rem; color: var(--text-secondary);">Carregando...</div>`;
    if (!this.user) return html``;

    return html`
      <header>
        <div>
          <h1>Painel Administrativo</h1>
          <div class="user-info">Logado como: <strong>${this.user.email}</strong></div>
        </div>
        <button class="logout" @click=${this.handleLogout}>Sair da Conta</button>
      </header>
      
      <div class="grid">
        <a href="/admin/produtos" class="card">
          <div class="icon">
            <svg viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
          </div>
          <h2>Produtos</h2>
          <p>Gerencie o catálogo de cestas, controle preços, defina categorias e ative ou inative produtos.</p>
        </a>
        
        <a href="/admin/categorias" class="card">
          <div class="icon">
            <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4zm0-6h8v2h-8z"/></svg>
          </div>
          <h2>Categorias</h2>
          <p>Organize seus produtos criando e gerenciando seções como Dia dos Namorados ou Aniversários.</p>
        </a>
        
        <a href="/admin/configuracoes" class="card">
          <div class="icon">
            <svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.73 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.3-.06.61-.06.94s.02.64.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .43-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.49-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
          </div>
          <h2>Configurações</h2>
          <p>Ajuste dados globais como o número do WhatsApp de destino e outras preferências da loja.</p>
        </a>
      </div>
    `;
  }
}
