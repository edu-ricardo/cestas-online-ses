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
      height: 80vh;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 2rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      width: 100%;
      max-width: 300px;
    }
    input {
      padding: 0.5rem;
    }
    button {
      padding: 0.5rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .error {
      color: red;
      font-size: 0.8rem;
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
