import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  conversations: any[] = [];
  activeChatId: string | null = null;
  activeClientName: string | null = null;
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
        this.loadMessages(this.activeChatId, false);
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

  selectConversation(chatId: string, aiActive: boolean, clientName: string) {
    this.activeChatId = chatId;
    this.isBotActive = aiActive;
    this.activeClientName = clientName;
    this.loadMessages(chatId, true);
  }

  loadMessages(chatId: string, forceScroll = false) {
    this.http.get(`${environment.apiUrl}/chat/conversations/${chatId}/messages`).subscribe({
      next: (res: any) => {
        const isNewMessageCount = res && res.length !== this.messages.length;
        this.messages = res;
        if (forceScroll || isNewMessageCount) {
          setTimeout(() => this.scrollToBottom(), 50);
        }
      },
      error: (err) => console.error('Error fetching messages', err)
    });
  }

  scrollToBottom() {
    try {
      if (this.scrollContainer && this.scrollContainer.nativeElement) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch (e) {}
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

  deleteCurrentConversation() {
    if (!this.activeChatId) return;
    this.deleteConversation(this.activeChatId);
  }

  deleteConversation(chatId: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    const confirmed = confirm('¿Estás seguro de que deseas eliminar este cliente y todo su historial de mensajes? Esta acción no se puede deshacer.');
    if (!confirmed) return;

    this.http.delete(`${environment.apiUrl}/chat/conversations/${chatId}`).subscribe({
      next: () => {
        if (this.activeChatId === chatId) {
          this.activeChatId = null;
          this.activeClientName = null;
          this.messages = [];
        }
        this.loadConversations();
      },
      error: (err) => console.error('Error deleting conversation', err)
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
        this.loadMessages(this.activeChatId!, true);
        this.loadConversations();
      },
      error: (err) => console.error('Error sending message', err)
    });
  }
}
