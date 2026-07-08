import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { SettingsService } from '../services/settings-service';

@customElement('admin-settings')
export class AdminSettings extends LitElement {
  @state() private whatsappNumber = '';
  @state() private loading = true;
  @state() private saving = false;
  @state() private message = '';

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
      box-shadow: var(--shadow-sm);
      max-width: 500px;
    }
    .form-container h3 {
      margin-top: 0;
      color: var(--text-primary);
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .form { 
      display: flex; 
      flex-direction: column; 
      gap: 1.25rem; 
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
    input { 
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
    button { 
      padding: 0.85rem; 
      background: var(--primary-color); 
      color: white; 
      border: none; 
      border-radius: 8px; 
      cursor: pointer; 
      font-weight: 600;
      transition: all 0.2s;
      margin-top: 0.5rem;
    }
    button:hover:not(:disabled) {
      background: var(--primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
    button:disabled { 
      background: var(--border-color); 
      color: var(--text-muted);
      cursor: not-allowed;
    }
    .success { 
      color: var(--success-color); 
      background: rgba(16, 185, 129, 0.1);
      padding: 0.75rem;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.9rem;
      text-align: center;
      margin-top: 1rem;
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
    const settings = await SettingsService.getSettings();
    if (settings) {
      this.whatsappNumber = settings.whatsappNumber;
    }
    this.loading = false;
  }

  async handleSave() {
    this.saving = true;
    this.message = '';
    try {
      await SettingsService.updateSettings({ whatsappNumber: this.whatsappNumber });
      this.message = 'Configurações salvas com sucesso!';
    } catch (e) {
      this.message = 'Erro ao salvar configurações.';
    } finally {
      this.saving = false;
    }
  }

  render() {
    return html`
      <a href="/admin/dashboard" class="back-link">
        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        Voltar ao Painel
      </a>

      <div class="header">
        <h2>Configurações da Loja</h2>
      </div>

      ${this.loading ? html`<p style="color: var(--text-secondary)">Carregando...</p>` : html`
        <div class="form-container">
          <h3>Preferências de Contato</h3>
          <div class="form">
            <div class="input-group">
              <label>Número do WhatsApp (com DDD, somente números)</label>
              <input 
                type="text" 
                placeholder="Ex: 5511999999999" 
                .value=${this.whatsappNumber}
                @input=${(e: any) => this.whatsappNumber = e.target.value}
              >
            </div>
            
            <button ?disabled=${this.saving} @click=${this.handleSave}>
              ${this.saving ? 'Salvando...' : 'Salvar Configurações'}
            </button>
            
            ${this.message ? html`<div class="success">${this.message}</div>` : ''}
          </div>
        </div>
      `}
    `;
  }
}
