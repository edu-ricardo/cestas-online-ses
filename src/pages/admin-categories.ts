import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { CategoryService } from '../services/data-service';
import type { Category } from '../services/data-service';

@customElement('admin-categories')
export class AdminCategories extends LitElement {
  @state() private categories: Category[] = [];
  @state() private newCategoryName = '';
  @state() private categoryDescription = '';
  @state() private editingCategoryId: string | null = null;
  @state() private isSpecialCatalog = false;
  @state() private hideFromAll = false;
  @state() private specialSlug = '';
  @state() private loading = true;
  @state() private draggedIndex: number | null = null;
  @state() private isSavingOrder = false;

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
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .checkbox-group {
      flex-direction: row;
      align-items: center;
      margin-bottom: 1rem;
    }
    .checkbox-group label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-primary);
      cursor: pointer;
      user-select: none;
    }
    .form-actions { 
      display: flex; 
      gap: 1rem; 
      align-items: center;
      margin-top: 1rem;
    }
    input, textarea { 
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
    textarea {
      resize: vertical;
      min-height: 80px;
    }
    input:focus, textarea:focus {
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
    .btn-cancel {
      background: var(--bg-main);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
      padding: 0.85rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-cancel:hover {
      background: var(--border-color);
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
      cursor: grab;
    }
    .category-item:active {
      cursor: grabbing;
    }
    .category-item.dragging {
      opacity: 0.5;
      box-shadow: var(--shadow-md);
      border-color: var(--primary-color);
    }
    .category-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .drag-handle {
      color: var(--text-muted);
      cursor: grab;
      display: flex;
      align-items: center;
    }
    .category-item span {
      font-weight: 500;
      color: var(--text-primary);
      font-size: 1.1rem;
    }
    .badge {
      background: rgba(99, 102, 241, 0.1);
      color: var(--primary-color);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .item-actions {
      display: flex;
      gap: 0.5rem;
    }
    .copy-btn {
      color: var(--text-secondary);
      background: transparent;
      border: 1px solid var(--border-color);
      padding: 0.5rem;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .copy-btn:hover {
      color: var(--primary-color);
      border-color: var(--primary-color);
      background: rgba(99, 102, 241, 0.05);
    }
    .edit-btn {
      color: var(--primary-color);
      border: 1px solid var(--primary-color);
      background: transparent;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }
    .edit-btn:hover {
      background: var(--primary-color);
      color: white;
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

  async handleSaveCategory() {
    if (!this.newCategoryName.trim()) return;
    
    const categoryData: Partial<Category> = {
      name: this.newCategoryName,
      isSpecialCatalog: this.isSpecialCatalog,
      hideFromAll: this.hideFromAll
    };

    if (this.categoryDescription.trim()) {
      categoryData.description = this.categoryDescription.trim();
    }

    if (this.isSpecialCatalog && this.specialSlug.trim()) {
      categoryData.specialSlug = this.specialSlug.trim();
    }

    if (this.editingCategoryId) {
      await CategoryService.update(this.editingCategoryId, categoryData);
    } else {
      await CategoryService.create(categoryData as Category);
    }
    
    this.cancelEdit();
    await this.loadCategories();
  }

  cancelEdit() {
    this.editingCategoryId = null;
    this.newCategoryName = '';
    this.categoryDescription = '';
    this.isSpecialCatalog = false;
    this.hideFromAll = false;
    this.specialSlug = '';
  }

  startEdit(cat: Category) {
    this.editingCategoryId = cat.id!;
    this.newCategoryName = cat.name;
    this.categoryDescription = cat.description || '';
    this.isSpecialCatalog = !!cat.isSpecialCatalog;
    this.hideFromAll = !!cat.hideFromAll;
    this.specialSlug = cat.specialSlug || '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async copyLink(slug: string) {
    const url = `${window.location.origin}/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copiado com sucesso:\\n' + url);
    } catch (err) {
      alert('Não foi possível copiar o link automaticamente. Copie manualmente:\\n' + url);
    }
  }

  async handleDelete(id: string) {
    if (confirm('Deseja realmente excluir esta categoria?')) {
      await CategoryService.delete(id);
      await this.loadCategories();
    }
  }

  dragStart(e: DragEvent, index: number) {
    this.draggedIndex = index;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      // Permite visualização correta no Firefox e outros browsers
      e.dataTransfer.setData('text/plain', index.toString());
    }
  }

  dragOver(e: DragEvent, index: number) {
    e.preventDefault();
    if (this.draggedIndex === null || this.draggedIndex === index) return;
    
    const newCategories = [...this.categories];
    const draggedItem = newCategories.splice(this.draggedIndex, 1)[0];
    newCategories.splice(index, 0, draggedItem);
    this.categories = newCategories;
    this.draggedIndex = index;
  }

  async drop(e: DragEvent) {
    e.preventDefault();
    await this.saveOrder();
  }
  
  dragEnd() {
    this.draggedIndex = null;
  }

  async saveOrder() {
    this.isSavingOrder = true;
    const updated = this.categories.map((c, index) => ({ ...c, order: index }));
    await CategoryService.updateBatch(updated);
    this.categories = updated;
    this.isSavingOrder = false;
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
        <h3>${this.editingCategoryId ? 'Editar Categoria' : 'Criar Nova Categoria'}</h3>
        <div class="form-group">
          <input 
            type="text" 
            placeholder="Nome da categoria (Ex: Cestas de Dia dos Namorados)" 
            .value=${this.newCategoryName}
            @input=${(e: any) => this.newCategoryName = e.target.value}
          >
        </div>
        <div class="form-group">
          <textarea 
            placeholder="Descrição da categoria (opcional)" 
            .value=${this.categoryDescription}
            @input=${(e: any) => this.categoryDescription = e.target.value}
          ></textarea>
        </div>
        <div class="checkbox-group">
          <label>
            <input type="checkbox" .checked=${this.isSpecialCatalog} @change=${(e: any) => this.isSpecialCatalog = e.target.checked}>
            É um Catálogo Especial? (Campanha separada da loja)
          </label>
          ${!this.isSpecialCatalog ? html`
            <label style="margin-top: 0.5rem; display: block;">
              <input type="checkbox" .checked=${this.hideFromAll} @change=${(e: any) => this.hideFromAll = e.target.checked}>
              Ocultar produtos desta categoria na aba "Todos"
            </label>
          ` : ''}
        </div>
        ${this.isSpecialCatalog ? html`
          <div class="form-group">
            <input 
              type="text" 
              placeholder="Link exclusivo (Ex: diadospais)" 
              .value=${this.specialSlug}
              @input=${(e: any) => this.specialSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')}
            >
          </div>
        ` : ''}
        <div class="form-actions">
          <button class="btn-add" @click=${this.handleSaveCategory}>
            ${this.editingCategoryId ? 'Salvar Alterações' : '+ Adicionar'}
          </button>
          ${this.editingCategoryId ? html`
            <button class="btn-cancel" @click=${this.cancelEdit}>Cancelar</button>
          ` : ''}
        </div>
      </div>

      ${this.loading ? html`<p style="color: var(--text-secondary)">Carregando categorias...</p>` : html`
        <div class="list">
          ${this.isSavingOrder ? html`<p style="color: var(--primary-color); font-size: 0.9rem; text-align: center;">Salvando ordem...</p>` : ''}
          ${this.categories.map((cat, index) => html`
            <div 
              class="category-item ${this.draggedIndex === index ? 'dragging' : ''}"
              draggable="true"
              @dragstart=${(e: DragEvent) => this.dragStart(e, index)}
              @dragover=${(e: DragEvent) => this.dragOver(e, index)}
              @drop=${this.drop}
              @dragend=${this.dragEnd}
            >
              <div class="category-info">
                <div class="drag-handle" title="Arraste para reordenar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"></path>
                  </svg>
                </div>
                <span>${cat.name}</span>
                ${cat.isSpecialCatalog ? html`<span class="badge">Especial: /${cat.specialSlug}</span>` : ''}
              </div>
              <div class="item-actions">
                ${cat.isSpecialCatalog ? html`
                  <button class="copy-btn" @click=${() => this.copyLink(cat.specialSlug!)} title="Copiar Link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                  </button>
                ` : ''}
                <button class="edit-btn" @click=${() => this.startEdit(cat)}>Editar</button>
                <button class="delete-btn" @click=${() => this.handleDelete(cat.id!)}>Excluir</button>
              </div>
            </div>
          `)}
        </div>
      `}
    `;
  }
}
