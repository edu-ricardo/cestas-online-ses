import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ProductService, CategoryService } from '../services/data-service';
import type { Product, Category } from '../services/data-service';

@customElement('home-page')
export class HomePage extends LitElement {
  @state() private products: Product[] = [];
  @state() private categories: Category[] = [];
  @state() private filteredProducts: Product[] = [];
  @state() private selectedCategoryId = '';
  @state() private searchQuery = '';
  @state() private loading = true;

  static styles = css`
    :host {
      display: block;
      max-width: 800px;
      margin: 0 auto;
      padding-bottom: 2rem;
    }

    header {
      padding: 1rem;
      text-align: center;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 10;
      transition: background-color 0.3s ease;
    }

    h1 {
      margin: 0;
      color: var(--text-primary);
    }

    .search-bar {
      margin: 1rem;
      display: flex;
      gap: 0.5rem;
    }

    .search-bar input {
      flex: 1;
      padding: 0.8rem 1.2rem;
      border: 1px solid var(--border-color);
      background: var(--bg-surface);
      color: var(--text-primary);
      border-radius: 25px;
      outline: none;
      transition: border-color 0.2s, background-color 0.3s ease;
    }

    .search-bar input:focus {
      border-color: var(--primary-color);
    }

    .categories-scroll {
      display: flex;
      overflow-x: auto;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      scrollbar-width: none;
    }
    .categories-scroll::-webkit-scrollbar { display: none; }

    .category-chip {
      white-space: nowrap;
      padding: 0.5rem 1.2rem;
      border-radius: 20px;
      background: var(--bg-surface);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s;
    }

    .category-chip:hover {
      background: var(--border-color);
    }

    .category-chip.active {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 1.5rem;
      padding: 1rem;
    }

    .product-card {
      border: 1px solid var(--border-color);
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      background: var(--bg-surface);
      transition: transform 0.2s, box-shadow 0.2s;
      text-decoration: none;
      color: inherit;
      box-shadow: var(--shadow-sm);
    }

    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
      border-color: var(--primary-color);
    }

    .product-card:active {
      transform: scale(0.98);
    }

    .product-image {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      background: var(--bg-main);
      border-bottom: 1px solid var(--border-color);
    }

    .product-info {
      padding: 1rem;
    }

    .product-title {
      font-weight: 600;
      font-size: 1.1rem;
      margin: 0;
      color: var(--text-primary);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-price {
      color: var(--primary-color);
      font-weight: 700;
      margin-top: 0.5rem;
      display: block;
      font-size: 1.1rem;
    }

    .admin-link {
      display: inline-block;
      width: 100%;
      text-align: center;
      margin-top: 3rem;
      color: var(--text-muted);
      font-size: 0.85rem;
      text-decoration: none;
      transition: color 0.2s;
    }
    
    .admin-link:hover {
      color: var(--primary-color);
    }

    @media (min-width: 600px) {
      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      }
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this.loadData();
  }

  async loadData() {
    this.loading = true;
    const [prods, cats] = await Promise.all([
      ProductService.getAll(true), // Apenas ativos
      CategoryService.getAll()
    ]);
    this.products = prods;
    this.categories = cats;
    this.applyFilters();
    this.loading = false;
  }

  handleSearch(e: Event) {
    this.searchQuery = (e.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters();
  }

  selectCategory(id: string) {
    this.selectedCategoryId = this.selectedCategoryId === id ? '' : id;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(this.searchQuery) || 
                            p.description.toLowerCase().includes(this.searchQuery);
      const matchesCategory = this.selectedCategoryId === '' || p.categoryId === this.selectedCategoryId;
      return matchesSearch && matchesCategory;
    });
  }

  render() {
    return html`
      <header>
        <h1>Sabores & Sonhos</h1>
      </header>

      <div class="search-bar">
        <input 
          type="text" 
          placeholder="Buscar produtos..." 
          .value=${this.searchQuery}
          @input=${this.handleSearch}
        >
      </div>

      <div class="categories-scroll">
        <div 
          class="category-chip ${this.selectedCategoryId === '' ? 'active' : ''}"
          @click=${() => this.selectCategory('')}
        >
          Todos
        </div>
        ${this.categories.map(cat => html`
          <div 
            class="category-chip ${this.selectedCategoryId === cat.id ? 'active' : ''}"
            @click=${() => this.selectCategory(cat.id!)}
          >
            ${cat.name}
          </div>
        `)}
      </div>

      ${this.loading ? html`<p style="text-align: center; padding: 2rem; color: var(--text-secondary);">Carregando catálogo...</p>` : html`
        <div class="products-grid">
          ${this.filteredProducts.map(p => html`
            <a href="/produto/${p.id}" class="product-card">
              <img class="product-image" src=${p.imageUrl} alt=${p.title}>
              <div class="product-info">
                <p class="product-title">${p.title}</p>
                <span class="product-price">R$ ${p.price.toFixed(2)}</span>
              </div>
            </a>
          `)}
        </div>
        ${this.filteredProducts.length === 0 ? html`<p style="text-align: center; color: var(--text-muted);">Nenhum produto encontrado.</p>` : ''}
      `}

      <a href="/admin" class="admin-link">Acesso Administrativo</a>
    `;
  }
}
