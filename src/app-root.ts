import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from '@lit-labs/router';

// Global CSS
import './index.css';

// Importando os componentes das páginas e globais
import './components/theme-switcher';
import './pages/home-page';
import './pages/admin-login';
import './pages/admin-dashboard';
import './pages/admin-categories';
import './pages/admin-products';
import './pages/admin-settings';
import './pages/product-details';

@customElement('app-root')
export class AppRoot extends LitElement {
  private _router = new Router(this, [
    { path: '/', render: () => html`<home-page></home-page>` },
    { path: '/admin', render: () => html`<admin-login></admin-login>` },
    { path: '/admin/dashboard', render: () => html`<admin-dashboard></admin-dashboard>` },
    { path: '/admin/categorias', render: () => html`<admin-categories></admin-categories>` },
    { path: '/admin/produtos', render: () => html`<admin-products></admin-products>` },
    { path: '/admin/configuracoes', render: () => html`<admin-settings></admin-settings>` },
    { path: '/produto/:id', render: (params) => html`<product-details .productId=${params.id}></product-details>` },
  ]);

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      font-family: var(--font-family, 'Inter', sans-serif);
      background-color: var(--bg-main);
      color: var(--text-primary);
    }
    .global-tools {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 1000;
    }
    main {
      padding: 1rem;
    }
  `;

  render() {
    return html`
      <div class="global-tools">
        <theme-switcher></theme-switcher>
      </div>
      <main>
        ${this._router.outlet()}
      </main>
    `;
  }
}
