import { Component, OnInit, OnDestroy, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-live-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './live-chat.component.html',
  styleUrls: ['./live-chat.component.css']
})
export class LiveChatComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  conversations: any[] = [];
  activeChatId: string | null = null;
  activeClientName: string | null = null;
  messages: any[] = [];
  isBotActive = true;
  newMessage = '';
  searchQuery = '';

  private pollingTimer: any = null;

  ngOnInit() {
    this.loadConversations();

    this.route.queryParams.subscribe(params => {
      if (params['chatId']) {
        const targetChatId = params['chatId'];
        this.selectConversation(targetChatId, true, `Chat ID: ${targetChatId}`);
      }
    });

    this.pollingTimer = setInterval(() => {
      this.loadConversations();
      if (this.activeChatId) {
        this.loadMessages(this.activeChatId, false);
      }
    }, 4000);
  }

  ngOnDestroy() {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
    }
  }

  trackByChatId(index: number, item: any): string {
    return item.chat_id || index;
  }

  trackByMsgId(index: number, item: any): string {
    return item.id || index;
  }

  get filteredConversations(): any[] {
    if (!this.searchQuery.trim()) {
      return this.conversations;
    }
    const query = this.searchQuery.toLowerCase().trim();
    return this.conversations.filter(chat => {
      const name = (chat.client_name || '').toLowerCase();
      const id = (chat.chat_id || '').toLowerCase();
      return name.includes(query) || id.includes(query);
    });
  }

  clearSearch() {
    this.searchQuery = '';
  }

  loadConversations() {
    this.http.get(`${environment.apiUrl}/chat/conversations`).subscribe({
      next: (res: any) => {
        if (JSON.stringify(res) !== JSON.stringify(this.conversations)) {
          this.conversations = res;
          // Si tenemos un activeChatId sin nombre, asignarle el nombre de la lista si existe
          if (this.activeChatId) {
            const found = this.conversations.find(c => c.chat_id === this.activeChatId);
            if (found && found.client_name) {
              this.activeClientName = found.client_name;
              this.isBotActive = found.ai_active;
            }
          }
        }
      },
      error: (err) => console.error('Error fetching conversations', err)
    });
  }

  selectConversation(chatId: string, aiActive: boolean, clientName: string) {
    if (this.activeChatId === chatId && this.messages.length > 0) return;
    this.activeChatId = chatId;
    this.isBotActive = aiActive;
    this.activeClientName = clientName;
    this.messages = [];
    this.loadMessages(chatId, true);
  }

  loadMessages(chatId: string, forceScroll = false) {
    this.http.get(`${environment.apiUrl}/chat/conversations/${chatId}/messages`).subscribe({
      next: (res: any) => {
        const isChanged = JSON.stringify(res) !== JSON.stringify(this.messages);
        if (isChanged) {
          this.messages = res;
          setTimeout(() => this.scrollToBottom(), 50);
        } else if (forceScroll) {
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

  // Modal Delete State
  showDeleteModal = false;
  chatToDelete: { id: string, name: string } | null = null;

  deleteCurrentConversation() {
    if (!this.activeChatId) return;
    this.openDeleteModal(this.activeChatId, this.activeClientName || `Chat ID: ${this.activeChatId}`);
  }

  deleteConversation(chatId: string, clientName?: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.openDeleteModal(chatId, clientName || `Chat ID: ${chatId}`);
  }

  openDeleteModal(chatId: string, name: string) {
    this.chatToDelete = { id: chatId, name };
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.chatToDelete = null;
  }

  confirmDelete() {
    if (!this.chatToDelete) return;
    const chatId = this.chatToDelete.id;

    this.http.delete(`${environment.apiUrl}/chat/conversations/${chatId}`).subscribe({
      next: () => {
        if (this.activeChatId === chatId) {
          this.activeChatId = null;
          this.activeClientName = null;
          this.messages = [];
        }
        this.showDeleteModal = false;
        this.chatToDelete = null;
        this.loadConversations();
      },
      error: (err) => {
        console.error('Error deleting conversation', err);
        this.showDeleteModal = false;
        this.chatToDelete = null;
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.activeChatId) return;
    
    const payload = {
      chatId: this.activeChatId,
      message: this.newMessage.trim()
    };
    
    this.newMessage = '';

    this.http.post(`${environment.apiUrl}/chat/send`, payload).subscribe({
      next: () => {
        this.isBotActive = false;
        this.loadMessages(this.activeChatId!, true);
        this.loadConversations();
      },
      error: (err) => console.error('Error sending message', err)
    });
  }
}
