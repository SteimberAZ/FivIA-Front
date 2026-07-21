import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot-management.component.html'
})
export class ChatbotManagementComponent {
  botName = '';
  botObjective = '';
  botType = 'soporte';
  aiActive = true;
  isSaving = false;
  saveMessage = '';

  saveConfig() {
    this.isSaving = true;
    this.saveMessage = 'Guardando configuración...';

    // In a real app, send to backend API
    setTimeout(() => {
      this.isSaving = false;
      this.saveMessage = '¡Configuración guardada correctamente!';
      setTimeout(() => this.saveMessage = '', 3000);
    }, 1000);
  }
}
