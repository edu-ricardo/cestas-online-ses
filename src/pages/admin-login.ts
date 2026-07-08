import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

@customElement('admin-login')
export class AdminLogin extends LitElement {
  @state() private email = '';
  @state() private password = '';
  @state() private error = '';

  static styles = css`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      padding: 2.5rem;
      border: 1px solid var(--border-color);
      border-radius: 16px;
      width: 100%;
      max-width: 340px;
      background: var(--bg-surface);
      box-shadow: var(--shadow-md);
    }
    h2 {
      margin: 0 0 0.5rem 0;
      color: var(--text-primary);
      text-align: center;
      font-size: 1.75rem;
    }
    input {
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      background: var(--bg-main);
      color: var(--text-primary);
      font-family: inherit;
      transition: border-color 0.2s;
    }
    input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    button {
      padding: 0.75rem;
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    button:hover {
      background-color: var(--primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
    .error {
      color: var(--danger-color);
      font-size: 0.85rem;
      text-align: center;
      background: rgba(239, 68, 68, 0.1);
      padding: 0.5rem;
      border-radius: 6px;
    }
  `;

  private async handleSubmit(e: Event) {
    e.preventDefault();
    this.error = '';
    try {
      await signInWithEmailAndPassword(auth, this.email, this.password);
      window.location.href = '/admin/dashboard';
    } catch (err: any) {
      this.error = 'Falha no login: ' + err.message;
    }
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <h2>Login Admin</h2>
        ${this.error ? html`<div class="error">${this.error}</div>` : ''}
        <input 
          type="email" 
          placeholder="Email" 
          .value=${this.email} 
          @input=${(e: any) => this.email = e.target.value}
          required
        >
        <input 
          type="password" 
          placeholder="Senha" 
          .value=${this.password} 
          @input=${(e: any) => this.password = e.target.value}
          required
        >
        <button type="submit">Entrar</button>
      </form>
    `;
  }
}
