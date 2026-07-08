import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('theme-switcher')
export class ThemeSwitcher extends LitElement {
  @state() private isDark = false;

  static styles = css`
    :host {
      display: inline-block;
    }
    button {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: var(--shadow-sm);
    }
    button:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }
    svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.initTheme();
  }

  private initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDark = savedTheme === 'dark';
    } else {
      this.isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyTheme();
  }

  private toggleTheme() {
    this.isDark = !this.isDark;
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme() {
    document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
  }

  render() {
    return html`
      <button @click=${this.toggleTheme} title="Alternar tema">
        ${this.isDark ? html`
          <!-- Sun Icon -->
          <svg viewBox="0 0 24 24">
            <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-14a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V2a1 1 0 0 1 1-1zm0 20a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1zm9-11a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1zm-20 0a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1zm16.36-6.36a1 1 0 0 1 1.42 0l1.41 1.41a1 1 0 0 1-1.41 1.42l-1.42-1.42a1 1 0 0 1 0-1.41zM4.22 19.78a1 1 0 0 1 1.42 0l1.41 1.41a1 1 0 1 1-1.41 1.42l-1.42-1.42a1 1 0 0 1 0-1.41zm15.56 0a1 1 0 0 1 0 1.42l-1.41 1.41a1 1 0 0 1-1.42-1.41l1.41-1.41a1 1 0 0 1 1.42 0zM4.22 4.22a1 1 0 0 1 0 1.42l-1.42 1.41a1 1 0 0 1-1.41-1.41l1.41-1.41a1 1 0 0 1 1.42 0z"/>
          </svg>
        ` : html`
          <!-- Moon Icon -->
          <svg viewBox="0 0 24 24">
            <path d="M21.75 14.5a8.5 8.5 0 1 1-9.25-12 1 1 0 0 1 1.25.9 6.5 6.5 0 0 0 9.1 7.8 1 1 0 0 1 1.15 1.15c-.25.75-.7 1.45-1.25 2.15zM12 20.5a6.5 6.5 0 0 0 6.5-6.5c-2.3 1.15-5.1.75-7.15-1.3C9.3 10.65 8.9 7.85 10.05 5.5A6.5 6.5 0 0 0 12 20.5z"/>
          </svg>
        `}
      </button>
    `;
  }
}
