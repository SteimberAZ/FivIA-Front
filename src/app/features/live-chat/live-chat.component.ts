import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-live-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './live-chat.component.html',
  styleUrls: ['./live-chat.component.css']
})
export class LiveChatComponent implements OnInit {
  conversations: any[] = [];
  activeChatId: string | null = null;
  messages: any[] = [];
  isBotActive = true;
  newMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadConversations();
    // En una aplicación real usaríamos WebSockets (Socket.io) o polling
    setInterval(() => {
      this.loadConversations();
      if (this.activeChatId) {
        this.loadMessages(this.activeChatId);
      }
    }, 5000);
  }

  loadConversations() {
    this.http.get(`${environment.apiUrl}/chat/conversations`).subscribe({
      next: (res: any) => {
        this.conversations = res;
      },
      error: (err) => console.error('Error fetching conversations', err)
    });
  }

  selectConversation(chatId: string, aiActive: boolean) {
    this.activeChatId = chatId;
    this.isBotActive = aiActive;
    this.loadMessages(chatId);
  }

  loadMessages(chatId: string) {
    this.http.get(`${environment.apiUrl}/chat/conversations/${chatId}/messages`).subscribe({
      next: (res: any) => {
        this.messages = res;
      },
      error: (err) => console.error('Error fetching messages', err)
    });
  }

  toggleHandoff() {
    if (!this.activeChatId) return;
    const newStatus = !this.isBotActive;
    this.http.post(`${environment.apiUrl}/chat/conversations/${this.activeChatId}/handoff`, { ai_active: newStatus }).subscribe({
      next: () => {
        this.isBotActive = newStatus;
        this.loadConversations();
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.activeChatId) return;
    
    const payload = {
      chatId: this.activeChatId,
      message: this.newMessage.trim()
    };
    
    this.newMessage = ''; // clear input

    this.http.post(`${environment.apiUrl}/chat/send`, payload).subscribe({
      next: () => {
        this.isBotActive = false; // Sending a message auto-silences the bot
        this.loadMessages(this.activeChatId!);
        this.loadConversations();
      },
      error: (err) => console.error('Error sending message', err)
    });
  }
}
