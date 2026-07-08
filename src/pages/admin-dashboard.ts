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
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eee;
      padding-bottom: 1rem;
    }
  `;

  async handleLogout() {
    await signOut(auth);
    window.location.href = '/admin';
  }

  render() {
    if (this.loading) return html`<p>Carregando...</p>`;
    if (!this.user) return html``;

    return html`
      <header>
        <h1>Painel Administrativo</h1>
        <button @click=${this.handleLogout}>Sair</button>
      </header>
      <nav>
        <ul>
          <li><a href="/admin/produtos">Gerenciar Produtos</a></li>
          <li><a href="/admin/categorias">Gerenciar Categorias</a></li>
          <li><a href="/admin/configuracoes">Configurações</a></li>
        </ul>
      </nav>
      <div>
        <p>Bem-vindo, ${this.user.email}!</p>
      </div>
    `;
  }
}
