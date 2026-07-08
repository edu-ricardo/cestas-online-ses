import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from '@lit-labs/router';

// Importando os componentes das páginas (que serão criados a seguir)
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
      font-family: sans-serif;
    }
    main {
      padding: 1rem;
    }
  `;

  render() {
    return html`
      <main>
        ${this._router.outlet()}
      </main>
    `;
  }
}
