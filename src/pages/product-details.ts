import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ProductService } from '../services/data-service';
import { SettingsService } from '../services/settings-service';
import type { Product, ProductImage } from '../services/data-service';
import '../components/image-carousel';

@customElement('product-details')
export class ProductDetails extends LitElement {
  @property({ type: String }) productId = '';
  @state() private product: Product | null = null;
  @state() private whatsappNumber = '';
  @state() private loading = true;

  static styles = css`
    :host {
      display: block;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
      background: var(--bg-main);
      min-height: 100vh;
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1.5rem;
      color: var(--primary-color);
      text-decoration: none;
      font-size: 1rem;
      font-weight: 500;
    }
    .back-btn svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }

    .image-container {
      width: 100%;
      aspect-ratio: 1;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-color);
      border-top: 1px solid var(--border-color);
    }

    .content {
      padding: 1.5rem;
    }

    .title {
      font-size: 1.8rem;
      margin: 0;
      color: var(--text-primary);
      font-weight: 700;
      line-height: 1.2;
    }

    .price {
      font-size: 1.5rem;
      color: var(--primary-color);
      font-weight: bold;
      margin: 1rem 0;
      display: block;
    }

    .description {
      color: var(--text-secondary);
      margin-top: 1rem;
      white-space: pre-wrap;
      font-size: 1.05rem;
    }

    .footer-action {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1rem;
      background: var(--bg-surface);
      box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
      display: flex;
      justify-content: center;
      z-index: 100;
      border-top: 1px solid var(--border-color);
    }

    .buy-btn {
      background: var(--success-color);
      color: white;
      text-decoration: none;
      padding: 1rem 2rem;
      border-radius: 30px;
      font-weight: bold;
      width: 100%;
      max-width: 400px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      transition: transform 0.2s;
    }

    .buy-btn:hover {
      transform: translateY(-2px);
    }
    
    .buy-btn:active {
      transform: scale(0.98);
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this.loadData();
  }

  async loadData() {
    this.loading = true;
    const [prod, settings] = await Promise.all([
      ProductService.getById(this.productId),
      SettingsService.getSettings()
    ]);
    
    this.product = prod;
    this.whatsappNumber = settings?.whatsappNumber || '';
    this.loading = false;
  }

  handleBuy() {
    if (!this.product || !this.whatsappNumber) return;

    let cleanPhone = this.whatsappNumber.replace(/\D/g, '');
    // Se o número tiver 10 ou 11 dígitos (DDD + Número), adicionamos o 55 do Brasil
    if (cleanPhone.length >= 10 && cleanPhone.length <= 11) {
      cleanPhone = '55' + cleanPhone;
    }

    const message = `Olá! Gostaria de encomendar o produto: *${this.product.title}* no valor de *R$ ${this.product.price.toFixed(2)}*.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  }

  render() {
    if (this.loading) return html`<p style="text-align: center; padding: 3rem; color: var(--text-secondary);">Carregando detalhes...</p>`;
    if (!this.product) return html`<p style="text-align: center; padding: 3rem; color: var(--text-secondary);">Produto não encontrado.</p>`;

    const productImages: ProductImage[] = this.product.images && this.product.images.length > 0 
      ? this.product.images 
      : (this.product.imageUrl ? [{ url: this.product.imageUrl, alt: this.product.title }] : []);

    return html`
      <a href="/" class="back-btn">
        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        Voltar para o catálogo
      </a>
      
      <div class="image-container">
        <image-carousel .images=${productImages}></image-carousel>
      </div>

      <div class="content">
        <h1 class="title">${this.product.title}</h1>
        <span class="price">R$ ${this.product.price.toFixed(2)}</span>
        <div class="description">${this.product.description}</div>
      </div>

      <div class="footer-action">
        <a href="#" class="buy-btn" @click=${(e: Event) => { e.preventDefault(); this.handleBuy(); }}>
          Fazer pedido via WhatsApp
        </a>
      </div>
      
      <div style="height: 80px;"></div> <!-- Espaçador para o botão fixo -->
    `;
  }
}
