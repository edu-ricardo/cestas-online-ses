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
    :host { 
      display: block; 
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem; 
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    h2 {
      margin: 0;
      color: var(--text-primary);
      font-size: 2rem;
      font-weight: 700;
    }
    .form-container {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 3rem;
      box-shadow: var(--shadow-sm);
    }
    .form-container h3 {
      margin-top: 0;
      color: var(--text-primary);
      font-size: 1.25rem;
      margin-bottom: 1rem;
    }
    .form { 
      display: flex; 
      gap: 1rem; 
      align-items: center;
    }
    input { 
      flex: 1;
      padding: 0.85rem 1rem; 
      border: 1px solid var(--border-color); 
      border-radius: 8px; 
      background: var(--bg-main);
      color: var(--text-primary);
      font-family: inherit;
      font-size: 1rem;
      transition: border-color 0.2s;
    }
    input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    .btn-add { 
      background: var(--primary-color); 
      color: white; 
      border: none; 
      padding: 0.85rem 2rem; 
      border-radius: 8px; 
      font-weight: 600;
      cursor: pointer; 
      transition: all 0.2s;
      white-space: nowrap;
    }
    .btn-add:hover {
      background: var(--primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
    .list {
      display: grid;
      gap: 1rem;
    }
    .category-item { 
      display: flex; 
      justify-content: space-between; 
      align-items: center;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1.25rem 1.5rem; 
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s;
    }
    .category-item:hover {
      transform: translateX(4px);
      border-color: var(--primary-color);
    }
    .category-item span {
      font-weight: 500;
      color: var(--text-primary);
      font-size: 1.1rem;
    }
    .delete-btn { 
      color: var(--danger-color); 
      border: 1px solid rgba(239, 68, 68, 0.3); 
      background: rgba(239, 68, 68, 0.05); 
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }
    .delete-btn:hover {
      background: var(--danger-color);
      color: white;
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 2rem;
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }
    .back-link:hover {
      color: var(--primary-color);
    }
    .back-link svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }
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
      <a href="/admin/dashboard" class="back-link">
        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        Voltar ao Painel
      </a>

      <div class="header">
        <h2>Gerenciar Categorias</h2>
      </div>
      
      <div class="form-container">
        <h3>Criar Nova Categoria</h3>
        <div class="form">
          <input 
            type="text" 
            placeholder="Ex: Cestas de Dia dos Namorados" 
            .value=${this.newCategoryName}
            @input=${(e: any) => this.newCategoryName = e.target.value}
            @keyup=${(e: KeyboardEvent) => e.key === 'Enter' && this.handleAddCategory()}
          >
          <button class="btn-add" @click=${this.handleAddCategory}>+ Adicionar</button>
        </div>
      </div>

      ${this.loading ? html`<p style="color: var(--text-secondary)">Carregando categorias...</p>` : html`
        <div class="list">
          ${this.categories.map(cat => html`
            <div class="category-item">
              <span>${cat.name}</span>
              <button class="delete-btn" @click=${() => this.handleDelete(cat.id!)}>Excluir</button>
            </div>
          `)}
        </div>
      `}
    `;
  }
}
