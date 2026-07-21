import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './integrations.component.html'
})
export class IntegrationsComponent {
  showTelegramForm = false;
  telegramToken = '';
  isSaving = false;
  saveMessage = '';

  constructor(private http: HttpClient) {}

  toggleTelegramForm() {
    this.showTelegramForm = !this.showTelegramForm;
  }

  saveTelegramToken() {
    if (!this.telegramToken.trim()) return;
    
    this.isSaving = true;
    this.saveMessage = 'Conectando con Telegram...';

    const payload = {
      token: this.telegramToken.trim(),
      backendUrl: environment.apiUrl.replace('/api', '') // We need the base URL, e.g. https://fivia-backend.vercel.app
    };

    this.http.post(`${environment.apiUrl}/telegram/setup`, payload).subscribe({
      next: (res: any) => {
        this.isSaving = false;
        this.saveMessage = '¡Conexión exitosa! El bot ya está activo.';
        setTimeout(() => this.showTelegramForm = false, 3000);
      },
      error: (err) => {
        this.isSaving = false;
        if (err.error && err.error.error) {
           this.saveMessage = 'Error: ' + err.error.error;
        } else {
           this.saveMessage = 'Error al conectar. Verifica tu Token.';
        }
        console.error(err);
      }
    });
  }
}
