import { Component, OnInit } from '@angular/core';
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
export class IntegrationsComponent implements OnInit {
  showTelegramForm = false;
  telegramToken = '';
  isSaving = false;
  saveMessage = '';
  activeIntegrations: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadActiveIntegrations();
  }

  loadActiveIntegrations() {
    this.http.get(`${environment.apiUrl}/integrations/active`).subscribe({
      next: (res: any) => {
        this.activeIntegrations = res;
      },
      error: (err) => console.error('Error fetching integrations', err)
    });
  }

  toggleTelegramForm() {
    this.showTelegramForm = !this.showTelegramForm;
  }

  saveTelegramToken() {
    if (!this.telegramToken.trim()) return;
    
    this.isSaving = true;
    this.saveMessage = 'Conectando con Telegram...';

    const payload = {
      token: this.telegramToken.trim(),
      backendUrl: environment.apiUrl.replace('/api', '') // We need the base URL
    };

    this.http.post(`${environment.apiUrl}/telegram/setup`, payload).subscribe({
      next: (res: any) => {
        this.isSaving = false;
        this.saveMessage = '¡Conexión exitosa! El bot ya está activo.';
        this.telegramToken = ''; // Clear input
        this.loadActiveIntegrations(); // Refresh list
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

  deleteIntegration(platform: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta conexión?')) {
      this.http.delete(`${environment.apiUrl}/integrations/${platform}`).subscribe({
        next: () => {
          this.loadActiveIntegrations();
        },
        error: (err) => {
          console.error('Error deleting integration', err);
          alert('No se pudo eliminar la integración.');
        }
      });
    }
  }
}
