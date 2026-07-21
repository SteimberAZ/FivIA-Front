import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-live-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live-chat.component.html',
  styleUrls: ['./live-chat.component.css']
})
export class LiveChatComponent {
  isBotActive = true;

  takeControl() {
    this.isBotActive = false;
    // Lógica para enviar evento a Supabase y apagar el bot
  }
}
