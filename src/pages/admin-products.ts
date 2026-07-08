import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ProductService, CategoryService } from '../services/data-service';
import type { Product, Category, ProductImage } from '../services/data-service';
import '../components/image-carousel';

@customElement('admin-products')
export class AdminProducts extends LitElement {
  @state() private products: Product[] = [];
  @state() private categories: Category[] = [];
  @state() private loading = true;
  @state() private showForm = false;

  @state() private productTitle = '';
  @state() private productDescription = '';
  @state() private price = 0;
  @state() private categoryId = '';
  @state() private isActive = true;
  @state() private images: ProductImage[] = [{ url: '', alt: '' }];
  @state() private editingProductId: string | null = null;

  static styles = css`
    :host { 
      display: block; 
      max-width: 1100px;
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
    .btn-add { 
      background: var(--primary-color); 
      color: white; 
      border: none; 
      padding: 0.75rem 1.5rem; 
      border-radius: 8px; 
      font-weight: 600;
      cursor: pointer; 
      transition: all 0.2s;
    }
    .btn-add:hover {
      background: var(--primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
    .btn-outline {
      background: transparent;
      color: var(--primary-color);
      border: 1px solid var(--primary-color);
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-outline:hover {
      background: var(--primary-color);
      color: white;
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
      font-size: 1.5rem;
    }
    .form { 
      display: grid; 
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem; 
    }
    .full-width {
      grid-column: 1 / -1;
    }
    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    label {
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-weight: 500;
    }
    input, textarea, select { 
      padding: 0.75rem; 
      border: 1px solid var(--border-color); 
      border-radius: 8px; 
      background: var(--bg-main);
      color: var(--text-primary);
      font-family: inherit;
      transition: border-color 0.2s;
    }
    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    .image-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background: var(--bg-main);
      padding: 1rem;
      border-radius: 12px;
      border: 1px solid var(--border-color);
    }
    .image-item {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      background: var(--bg-surface);
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
    }
    .image-inputs {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .btn-remove-img {
      color: var(--danger-color);
      background: rgba(239, 68, 68, 0.1);
      border: none;
      padding: 0.5rem;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .btn-remove-img:hover {
      background: var(--danger-color);
      color: white;
    }
    .checkbox-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      color: var(--text-primary);
      font-weight: 500;
    }
    .checkbox-group input {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
    .product-grid { 
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }
    .product-card { 
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s;
    }
    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
    }
    .img-preview {
      width: 100%;
      height: 220px;
      border-bottom: 1px solid var(--border-color);
      background: var(--bg-main);
    }
    .product-info {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .product-title {
      font-weight: 600;
      font-size: 1.25rem;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }
    .product-price {
      color: var(--primary-color);
      font-weight: 700;
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }
    .status {
      align-self: flex-start;
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }
    .status.active {
      background: rgba(16, 185, 129, 0.15);
      color: var(--success-color);
    }
    .status.inactive {
      background: rgba(107, 114, 128, 0.15);
      color: var(--text-secondary);
    }
    .actions { 
      display: flex; 
      gap: 0.75rem; 
      margin-top: auto;
    }
    .btn-action {
      flex: 1;
      padding: 0.5rem;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      background: var(--bg-main);
      color: var(--text-primary);
      cursor: pointer;
      font-weight: 600;
      font-size: 0.85rem;
      transition: all 0.2s;
    }
    .btn-action:hover {
      background: var(--border-color);
    }
    .btn-edit {
      color: #3b82f6;
      border-color: rgba(59, 130, 246, 0.3);
      background: rgba(59, 130, 246, 0.05);
    }
    .btn-edit:hover {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }
    .btn-delete { 
      color: var(--danger-color); 
      border-color: rgba(239, 68, 68, 0.3);
      background: rgba(239, 68, 68, 0.05);
    }
    .btn-delete:hover {
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

  addImage() {
    this.images = [...this.images, { url: '', alt: '' }];
  }

  updateImage(index: number, field: 'url' | 'alt', value: string) {
    const newImages = [...this.images];
    newImages[index][field] = value;
    this.images = newImages;
  }

  removeImage(index: number) {
    const newImages = [...this.images];
    newImages.splice(index, 1);
    this.images = newImages;
  }

  async handleSubmit(e: Event) {
    e.preventDefault();
    
    // Filtra apenas imagens que tem pelo menos a URL preenchida
    const validImages = this.images.filter(img => img.url.trim() !== '');
    
    const productData: Partial<Product> = {
      title: this.productTitle,
      description: this.productDescription,
      price: Number(this.price),
      categoryId: this.categoryId,
      images: validImages,
      isActive: this.isActive,
    };

    // Para compatibilidade, setar imageUrl com a primeira imagem caso exista
    if (validImages.length > 0) {
      productData.imageUrl = validImages[0].url;
    }

    if (this.editingProductId) {
      await ProductService.update(this.editingProductId, productData);
    } else {
      (productData as Product).createdAt = Date.now();
      await ProductService.create(productData as Omit<Product, 'id'>);
    }

    this.resetForm();
    await this.loadProducts();
  }

  resetForm() {
    this.productTitle = '';
    this.productDescription = '';
    this.price = 0;
    this.categoryId = '';
    this.images = [{ url: '', alt: '' }];
    this.isActive = true;
    this.editingProductId = null;
    this.showForm = false;
  }

  editProduct(product: Product) {
    this.editingProductId = product.id!;
    this.productTitle = product.title;
    this.productDescription = product.description;
    this.price = product.price;
    this.categoryId = product.categoryId;
    this.isActive = product.isActive;
    
    if (product.images && product.images.length > 0) {
      this.images = [...product.images];
    } else if (product.imageUrl) {
      this.images = [{ url: product.imageUrl, alt: product.title }];
    } else {
      this.images = [{ url: '', alt: '' }];
    }
    
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <a href="/admin/dashboard" class="back-link">
        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        Voltar ao Painel
      </a>
      
      <div class="header">
        <h2>Gerenciar Produtos</h2>
        <button class="btn-add" @click=${() => { this.resetForm(); this.showForm = !this.showForm; }}>
          ${this.showForm ? 'Cancelar' : '+ Novo Produto'}
        </button>
      </div>

      ${this.showForm ? html`
        <div class="form-container">
          <h3>${this.editingProductId ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h3>
          <form class="form" @submit=${this.handleSubmit}>
            <div class="input-group">
              <label>Título do Produto</label>
              <input type="text" .value=${this.productTitle} @input=${(e: any) => this.productTitle = e.target.value} required>
            </div>
            <div class="input-group">
              <label>Preço (R$)</label>
              <input type="number" step="0.01" .value=${this.price} @input=${(e: any) => this.price = e.target.value} required>
            </div>
            <div class="input-group full-width">
              <label>Descrição</label>
              <textarea rows="3" .value=${this.productDescription} @input=${(e: any) => this.productDescription = e.target.value} required></textarea>
            </div>
            <div class="input-group full-width">
              <label>Categoria</label>
              <select @change=${(e: any) => this.categoryId = e.target.value} required>
                <option value="">Selecione uma Categoria...</option>
                ${this.categories.map(cat => html`<option value=${cat.id!}>${cat.name}</option>`)}
              </select>
            </div>
            
            <div class="input-group full-width">
              <label style="display: flex; justify-content: space-between; align-items: center;">
                <span>Imagens do Produto</span>
                <button type="button" class="btn-outline" @click=${this.addImage}>+ Adicionar Imagem</button>
              </label>
              <div class="image-list">
                ${this.images.map((img, index) => html`
                  <div class="image-item">
                    <div class="image-inputs">
                      <input 
                        type="url" 
                        placeholder="URL da Imagem (obrigatório)" 
                        .value=${img.url} 
                        @input=${(e: any) => this.updateImage(index, 'url', e.target.value)} 
                        required
                      >
                      <input 
                        type="text" 
                        placeholder="Texto Alternativo / Hint (para acessibilidade)" 
                        .value=${img.alt} 
                        @input=${(e: any) => this.updateImage(index, 'alt', e.target.value)}
                      >
                    </div>
                    ${this.images.length > 1 ? html`
                      <button type="button" class="btn-remove-img" @click=${() => this.removeImage(index)} title="Remover">
                        <svg viewBox="0 0 24 24" width="24" height="24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                      </button>
                    ` : ''}
                  </div>
                `)}
              </div>
            </div>

            <div class="input-group full-width" style="margin-top: 1rem;">
              <label class="checkbox-group">
                <input type="checkbox" ?checked=${this.isActive} @change=${(e: any) => this.isActive = e.target.checked}>
                Deixar produto ativo (visível no catálogo público)
              </label>
            </div>
            <div class="input-group full-width" style="margin-top: 1rem;">
              <button type="submit" class="btn-add">${this.editingProductId ? 'Atualizar Produto' : 'Salvar Produto'}</button>
            </div>
          </form>
        </div>
      ` : ''}

      ${this.loading ? html`<p style="color: var(--text-secondary)">Carregando catálogo...</p>` : html`
        <div class="product-grid">
          ${this.products.map(p => {
            const productImages = p.images && p.images.length > 0 ? p.images : (p.imageUrl ? [{ url: p.imageUrl, alt: p.title }] : []);
            
            return html`
              <div class="product-card">
                <div class="img-preview">
                  <image-carousel .images=${productImages}></image-carousel>
                </div>
                <div class="product-info">
                  <div class="product-title">${p.title}</div>
                  <div class="product-price">R$ ${p.price.toFixed(2)}</div>
                  <div class="status ${p.isActive ? 'active' : 'inactive'}">
                    ${p.isActive ? 'Em Estoque (Ativo)' : 'Inativo'}
                  </div>
                  <div class="actions">
                    <button class="btn-action btn-edit" @click=${() => this.editProduct(p)}>Editar</button>
                    <button class="btn-action" @click=${() => this.toggleActive(p)}>${p.isActive ? 'Inativar' : 'Ativar'}</button>
                    <button class="btn-action btn-delete" @click=${() => this.handleDelete(p.id!)}>Excluir</button>
                  </div>
                </div>
              </div>
            `;
          })}
        </div>
      `}
    `;
  }
}
