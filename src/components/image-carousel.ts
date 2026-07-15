import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { ProductImage } from '../services/data-service';

@customElement('image-carousel')
export class ImageCarousel extends LitElement {
  @property({ type: Array }) images: ProductImage[] = [];
  @property({ type: String }) fit: 'cover' | 'contain' = 'cover';
  @property({ type: Boolean }) enableLightbox = false;
  @state() private activeIndex = 0;
  @state() private isFullscreen = false;

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

    /* Lightbox Styles */
    .lightbox {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.95);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: none;
    }
    .lightbox img {
      max-width: 100vw;
      max-height: 100vh;
      object-fit: contain;
    }
    .close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(255,255,255,0.1);
      color: white;
      border: none;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
      z-index: 10000;
    }
    .close-btn:hover {
      background: rgba(255,255,255,0.3);
    }
    .lightbox .nav-btn {
      width: 50px;
      height: 50px;
      background: rgba(255,255,255,0.1);
      opacity: 1; /* Always visible in lightbox */
    }
    .lightbox .nav-btn:hover {
      background: rgba(255,255,255,0.3);
    }
    .lightbox .nav-btn.prev { left: 20px; }
    .lightbox .nav-btn.next { right: 20px; }
    .lightbox .nav-btn svg { width: 30px; height: 30px; }
    
    .cursor-zoom {
      cursor: zoom-in;
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
      this.activeIndex++;
      this.scrollToIndex(this.activeIndex);
    }
  }

  private prev(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    if (this.activeIndex > 0) {
      this.activeIndex--;
      this.scrollToIndex(this.activeIndex);
    }
  }

  render() {
    if (!this.images || this.images.length === 0) {
      return html`
        <div class="slide">
          <img src="https://via.placeholder.com/300x300?text=Sem+Imagem" alt="Sem Imagem" style="object-fit: ${this.fit}" />
        </div>
      `;
    }

    return html`
      <div class="carousel-container" @scroll=${this.handleScroll}>
        ${this.images.map((img, i) => html`
          <div class="slide">
            <img 
              src=${img.url} 
              alt=${img.alt || 'Imagem do Produto'} 
              loading="lazy" 
              class=${this.enableLightbox ? "cursor-zoom" : ""}
              style="object-fit: ${this.fit}"
              @click=${(e: Event) => {
                if (this.enableLightbox) {
                  e.preventDefault();
                  e.stopPropagation();
                  this.activeIndex = i;
                  this.isFullscreen = true;
                }
              }}
              onerror="this.src='https://via.placeholder.com/300x300?text=Erro'"
            />
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

      ${this.isFullscreen ? html`
        <div class="lightbox" @click=${(e: Event) => { if(e.target === e.currentTarget) this.isFullscreen = false; }}>
          <button class="close-btn" @click=${() => this.isFullscreen = false} aria-label="Fechar">
            <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>

          <img src=${this.images[this.activeIndex].url} alt="Imagem Ampliada" />

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
          ` : ''}
        </div>
      ` : ''}
    `;
  }
}
