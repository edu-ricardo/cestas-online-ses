import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { ProductImage } from '../services/data-service';

@customElement('image-carousel')
export class ImageCarousel extends LitElement {
  @property({ type: Array }) images: ProductImage[] = [];
  @state() private activeIndex = 0;

  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
    }
    .carousel-container {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scrollbar-width: none; /* Firefox */
      width: 100%;
      height: 100%;
    }
    .carousel-container::-webkit-scrollbar {
      display: none; /* Chrome/Safari */
    }
    .slide {
      flex: 0 0 100%;
      width: 100%;
      height: 100%;
      scroll-snap-align: start;
    }
    .slide img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      background: var(--bg-main);
    }
    .nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0, 0, 0, 0.4);
      color: white;
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s, background 0.2s;
    }
    .nav-btn:hover {
      background: rgba(0, 0, 0, 0.7);
    }
    /* Show buttons only when hovering over the host */
    :host(:hover) .nav-btn {
      opacity: 1;
    }
    /* Always show buttons on touch devices */
    @media (hover: none) {
      .nav-btn {
        opacity: 1;
      }
    }
    .nav-btn.prev {
      left: 8px;
    }
    .nav-btn.next {
      right: 8px;
    }
    .nav-btn svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }
    .indicators {
      position: absolute;
      bottom: 8px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      gap: 6px;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      transition: background 0.2s;
    }
    .dot.active {
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 0 2px rgba(0,0,0,0.5);
    }
  `;

  private handleScroll(e: Event) {
    const container = e.target as HTMLElement;
    const scrollLeft = container.scrollLeft;
    const width = container.offsetWidth;
    if (width > 0) {
      this.activeIndex = Math.round(scrollLeft / width);
    }
  }

  private scrollToIndex(index: number) {
    const container = this.shadowRoot?.querySelector('.carousel-container') as HTMLElement;
    if (container) {
      container.scrollTo({
        left: index * container.offsetWidth,
        behavior: 'smooth'
      });
    }
  }

  private next(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    if (this.activeIndex < this.images.length - 1) {
      this.scrollToIndex(this.activeIndex + 1);
    }
  }

  private prev(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    if (this.activeIndex > 0) {
      this.scrollToIndex(this.activeIndex - 1);
    }
  }

  render() {
    if (!this.images || this.images.length === 0) {
      return html`
        <div class="slide">
          <img src="https://via.placeholder.com/300x300?text=Sem+Imagem" alt="Sem Imagem" />
        </div>
      `;
    }

    return html`
      <div class="carousel-container" @scroll=${this.handleScroll}>
        ${this.images.map(img => html`
          <div class="slide">
            <img src=${img.url} alt=${img.alt || 'Imagem do Produto'} loading="lazy" onerror="this.src='https://via.placeholder.com/300x300?text=Erro'"/>
          </div>
        `)}
      </div>

      ${this.images.length > 1 ? html`
        ${this.activeIndex > 0 ? html`
          <button class="nav-btn prev" @click=${this.prev} aria-label="Anterior">
            <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
          </button>
        ` : ''}
        
        ${this.activeIndex < this.images.length - 1 ? html`
          <button class="nav-btn next" @click=${this.next} aria-label="Próxima">
            <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
          </button>
        ` : ''}

        <div class="indicators">
          ${this.images.map((_, i) => html`
            <div class="dot ${i === this.activeIndex ? 'active' : ''}"></div>
          `)}
        </div>
      ` : ''}
    `;
  }
}
