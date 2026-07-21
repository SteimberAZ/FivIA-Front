import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SupabaseService } from './supabase.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = environment.apiUrl + '/chat';
  private messagesSubject = new Subject<any>();

  constructor(private http: HttpClient, private supabaseService: SupabaseService) {
    this.listenToMessages();
  }

  // Enviar mensaje manual (Handoff)
  sendMessage(chatId: string, message: string) {
    return this.http.post(`${this.apiUrl}/send`, { chatId, message });
  }

  // Obtener historial de una conversación
  async getMessages(chatId: string) {
    const { data, error } = await this.supabaseService.client
      .from('Messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  // Escuchar nuevos mensajes en tiempo real
  private listenToMessages() {
    this.supabaseService.client
      .channel('public:Messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Messages' }, payload => {
        this.messagesSubject.next(payload.new);
      })
      .subscribe();
  }

  getNewMessages(): Observable<any> {
    return this.messagesSubject.asObservable();
  }
}
