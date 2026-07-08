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
    :host { display: block; padding: 1rem; }
    .form { display: flex; flex-direction: column; gap: 1rem; max-width: 400px; }
    input { padding: 0.5rem; }
    button { padding: 0.7rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:disabled { background: #ccc; }
    .success { color: green; }
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
    if (this.loading) return html`<p>Carregando...</p>`;

    return html`
      <h2>Configurações da Loja</h2>
      <div class="form">
        <label>Número do WhatsApp (com DDD, somente números):</label>
        <input 
          type="text" 
          placeholder="Ex: 5511999999999" 
          .value=${this.whatsappNumber}
          @input=${(e: any) => this.whatsappNumber = e.target.value}
        >
        <button ?disabled=${this.saving} @click=${this.handleSave}>
          ${this.saving ? 'Salvando...' : 'Salvar Configurações'}
        </button>
        ${this.message ? html`<p class="success">${this.message}</p>` : ''}
      </div>
      <br>
      <a href="/admin/dashboard">Voltar ao Painel</a>
    `;
  }
}
