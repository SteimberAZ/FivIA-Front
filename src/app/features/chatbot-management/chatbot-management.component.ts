import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-chatbot-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot-management.component.html'
})
export class ChatbotManagementComponent implements OnInit {
  botName = '';
  botObjective = '';
  botType = 'soporte';
  aiActive = true;
  isSaving = false;
  saveMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadConfig();
  }

  loadConfig() {
    this.http.get(`${environment.apiUrl}/bot/config`).subscribe({
      next: (res: any) => {
        if (res) {
          this.botName = res.bot_name || '';
          this.botObjective = res.bot_objective || '';
          this.botType = res.bot_type || 'soporte';
          this.aiActive = res.global_ai_active !== undefined ? res.global_ai_active : true;
        }
      },
      error: (err) => console.error('Error fetching config', err)
    });
  }

  saveConfig() {
    this.isSaving = true;
    this.saveMessage = 'Guardando configuración...';

    const payload = {
      bot_name: this.botName,
      bot_objective: this.botObjective,
      bot_type: this.botType,
      global_ai_active: this.aiActive
    };

    this.http.post(`${environment.apiUrl}/bot/config`, payload).subscribe({
      next: (res: any) => {
        this.isSaving = false;
        this.saveMessage = '¡Configuración guardada correctamente!';
        setTimeout(() => this.saveMessage = '', 3000);
      },
      error: (err) => {
        this.isSaving = false;
        this.saveMessage = 'Error al guardar la configuración.';
        console.error(err);
      }
    });
  }
}
