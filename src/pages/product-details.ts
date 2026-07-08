import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ProductService } from '../services/data-service';
import { SettingsService } from '../services/settings-service';
import type { Product } from '../services/data-service';

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
      font-family: sans-serif;
      line-height: 1.6;
    }

    .back-btn {
      display: inline-block;
      padding: 1rem;
      color: #007bff;
      text-decoration: none;
      font-size: 0.9rem;
    }

    .image-container {
      width: 100%;
      aspect-ratio: 1;
      background: #f9f9f9;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .content {
      padding: 1.5rem;
    }

    .title {
      font-size: 1.5rem;
      margin: 0;
    }

    .price {
      font-size: 1.3rem;
      color: #28a745;
      font-weight: bold;
      margin: 0.5rem 0;
      display: block;
    }

    .description {
      color: #555;
      margin-top: 1rem;
      white-space: pre-wrap;
    }

    .footer-action {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1rem;
      background: white;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
      display: flex;
      justify-content: center;
      z-index: 100;
    }

    .buy-btn {
      background: #25d366;
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
      gap: 0.5rem;
    }

    .buy-btn:active {
      background: #128c7e;
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

    const message = `Olá! Gostaria de encomendar o produto: *${this.product.title}* no valor de *R$ ${this.product.price.toFixed(2)}*.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  }

  render() {
    if (this.loading) return html`<p style="text-align: center; padding: 3rem;">Carregando detalhes...</p>`;
    if (!this.product) return html`<p style="text-align: center; padding: 3rem;">Produto não encontrado.</p>`;

    return html`
      <a href="/" class="back-btn">← Voltar para o catálogo</a>
      
      <div class="image-container">
        <img src=${this.product.imageUrl} alt=${this.product.title}>
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
