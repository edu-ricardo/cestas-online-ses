import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ProductService, CategoryService } from '../services/data-service';
import type { Product, Category } from '../services/data-service';

@customElement('admin-products')
export class AdminProducts extends LitElement {
  @state() private products: Product[] = [];
  @state() private categories: Category[] = [];
  @state() private loading = true;
  @state() private showForm = false;

  // Form states - Alterado 'title' para 'productTitle' para evitar conflito com HTMLElement.title
  @state() private productTitle = '';
  @state() private productDescription = '';
  @state() private price = 0;
  @state() private categoryId = '';
  @state() private imageUrl = '';
  @state() private isActive = true;

  static styles = css`
    :host { display: block; padding: 1rem; }
    .product-list { margin-top: 1rem; }
    .product-item { 
      display: flex; 
      justify-content: space-between; 
      align-items: center;
      padding: 1rem; 
      border-bottom: 1px solid #eee; 
    }
    .form { 
      display: flex; 
      flex-direction: column; 
      gap: 1rem; 
      max-width: 500px; 
      background: #f9f9f9; 
      padding: 1.5rem; 
      border-radius: 8px;
    }
    input, textarea, select { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
    .actions { display: flex; gap: 0.5rem; }
    .btn-add { background: green; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
    .btn-delete { color: red; border: none; background: none; cursor: pointer; }
    .status-active { color: green; font-size: 0.8rem; }
    .status-inactive { color: gray; font-size: 0.8rem; }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await Promise.all([this.loadProducts(), this.loadCategories()]);
  }

  async loadProducts() {
    this.loading = true;
    this.products = await ProductService.getAll();
    this.loading = false;
  }

  async loadCategories() {
    this.categories = await CategoryService.getAll();
  }

  async handleSubmit(e: Event) {
    e.preventDefault();
    const product: Omit<Product, 'id'> = {
      title: this.productTitle,
      description: this.productDescription,
      price: Number(this.price),
      categoryId: this.categoryId,
      imageUrl: this.imageUrl,
      isActive: this.isActive,
      createdAt: Date.now()
    };

    await ProductService.create(product);
    this.resetForm();
    await this.loadProducts();
  }

  resetForm() {
    this.productTitle = '';
    this.productDescription = '';
    this.price = 0;
    this.categoryId = '';
    this.imageUrl = '';
    this.isActive = true;
    this.showForm = false;
  }

  async handleDelete(id: string) {
    if (confirm('Excluir este produto permanentemente?')) {
      await ProductService.delete(id);
      await this.loadProducts();
    }
  }

  async toggleActive(product: Product) {
    await ProductService.update(product.id!, { isActive: !product.isActive });
    await this.loadProducts();
  }

  render() {
    return html`
      <h2>Gerenciar Produtos</h2>
      
      <button class="btn-add" @click=${() => this.showForm = !this.showForm}>
        ${this.showForm ? 'Cancelar' : 'Novo Produto'}
      </button>

      ${this.showForm ? html`
        <form class="form" @submit=${this.handleSubmit}>
          <h3>Cadastrar Produto</h3>
          <input type="text" placeholder="Título" .value=${this.productTitle} @input=${(e: any) => this.productTitle = e.target.value} required>
          <textarea placeholder="Descrição" .value=${this.productDescription} @input=${(e: any) => this.productDescription = e.target.value} required></textarea>
          <input type="number" step="0.01" placeholder="Preço" .value=${this.price} @input=${(e: any) => this.price = e.target.value} required>
          
          <select @change=${(e: any) => this.categoryId = e.target.value} required>
            <option value="">Selecione uma Categoria</option>
            ${this.categories.map(cat => html`<option value=${cat.id!}>${cat.name}</option>`)}
          </select>

          <input type="url" placeholder="URL da Imagem" .value=${this.imageUrl} @input=${(e: any) => this.imageUrl = e.target.value} required>
          
          <label>
            <input type="checkbox" ?checked=${this.isActive} @change=${(e: any) => this.isActive = e.target.checked}>
            Ativo (visível no catálogo)
          </label>

          <button type="submit" class="btn-add">Salvar Produto</button>
        </form>
      ` : ''}

      ${this.loading ? html`<p>Carregando...</p>` : html`
        <div class="product-list">
          ${this.products.map(p => html`
            <div class="product-item">
              <div>
                <strong>${p.title}</strong> - R$ ${p.price.toFixed(2)}<br>
                <span class=${p.isActive ? 'status-active' : 'status-inactive'}>
                  ${p.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div class="actions">
                <button @click=${() => this.toggleActive(p)}>${p.isActive ? 'Inativar' : 'Ativar'}</button>
                <button class="btn-delete" @click=${() => this.handleDelete(p.id!)}>Excluir</button>
              </div>
            </div>
          `)}
        </div>
      `}
      <br>
      <a href="/admin/dashboard">Voltar ao Painel</a>
    `;
  }
}
