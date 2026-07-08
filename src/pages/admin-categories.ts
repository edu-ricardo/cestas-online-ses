import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { CategoryService } from '../services/data-service';
import type { Category } from '../services/data-service';

@customElement('admin-categories')
export class AdminCategories extends LitElement {
  @state() private categories: Category[] = [];
  @state() private newCategoryName = '';
  @state() private loading = true;

  static styles = css`
    :host { display: block; padding: 1rem; }
    .form { margin-bottom: 2rem; display: flex; gap: 0.5rem; }
    input { padding: 0.5rem; flex: 1; }
    button { padding: 0.5rem 1rem; cursor: pointer; }
    .category-item { 
      display: flex; 
      justify-content: space-between; 
      padding: 0.5rem; 
      border-bottom: 1px solid #eee; 
    }
    .delete-btn { color: red; border: none; background: none; }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this.loadCategories();
  }

  async loadCategories() {
    this.loading = true;
    this.categories = await CategoryService.getAll();
    this.loading = false;
  }

  async handleAddCategory() {
    if (!this.newCategoryName.trim()) return;
    await CategoryService.create({ name: this.newCategoryName });
    this.newCategoryName = '';
    await this.loadCategories();
  }

  async handleDelete(id: string) {
    if (confirm('Deseja realmente excluir esta categoria?')) {
      await CategoryService.delete(id);
      await this.loadCategories();
    }
  }

  render() {
    return html`
      <h2>Gerenciar Categorias</h2>
      
      <div class="form">
        <input 
          type="text" 
          placeholder="Nome da nova categoria" 
          .value=${this.newCategoryName}
          @input=${(e: any) => this.newCategoryName = e.target.value}
        >
        <button @click=${this.handleAddCategory}>Adicionar</button>
      </div>

      ${this.loading ? html`<p>Carregando...</p>` : html`
        <div class="list">
          ${this.categories.map(cat => html`
            <div class="category-item">
              <span>${cat.name}</span>
              <button class="delete-btn" @click=${() => this.handleDelete(cat.id!)}>Excluir</button>
            </div>
          `)}
        </div>
      `}
      <br>
      <a href="/admin/dashboard">Voltar ao Painel</a>
    `;
  }
}
