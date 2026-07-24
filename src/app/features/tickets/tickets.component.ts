import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Ticket {
  id: string;
  chat_id: string;
  client_name: string;
  summary: string;
  status: 'en_proceso' | 'resuelto' | 'rechazado';
  created_at: string;
}

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  tickets: Ticket[] = [];
  isLoading = false;
  activeFilter: 'todos' | 'en_proceso' | 'resuelto' | 'rechazado' = 'todos';
  searchQuery = '';

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.isLoading = true;
    this.http.get<Ticket[]>(`${environment.apiUrl}/tickets`).subscribe({
      next: (res) => {
        this.tickets = res || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching tickets:', err);
        this.isLoading = false;
      }
    });
  }

  get filteredTickets(): Ticket[] {
    return this.tickets.filter(t => {
      const matchesFilter = this.activeFilter === 'todos' || t.status === this.activeFilter;
      const query = this.searchQuery.toLowerCase().trim();
      const matchesQuery = !query || 
        (t.client_name || '').toLowerCase().includes(query) || 
        (t.summary || '').toLowerCase().includes(query) ||
        (t.chat_id || '').toLowerCase().includes(query);

      return matchesFilter && matchesQuery;
    });
  }

  setFilter(filter: 'todos' | 'en_proceso' | 'resuelto' | 'rechazado') {
    this.activeFilter = filter;
  }

  updateStatus(ticketId: string, status: 'en_proceso' | 'resuelto' | 'rechazado') {
    this.http.put(`${environment.apiUrl}/tickets/${ticketId}/status`, { status }).subscribe({
      next: () => {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (ticket) {
          ticket.status = status;
        }
      },
      error: (err) => console.error('Error updating ticket status', err)
    });
  }

  deleteTicket(ticketId: string, event?: Event) {
    if (event) event.stopPropagation();
    this.http.delete(`${environment.apiUrl}/tickets/${ticketId}`).subscribe({
      next: () => {
        this.tickets = this.tickets.filter(t => t.id !== ticketId);
      },
      error: (err) => console.error('Error deleting ticket', err)
    });
  }

  goToLiveChat(chatId: string) {
    this.router.navigate(['/live-chat'], { queryParams: { chatId } });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'resuelto':
        return 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-400 border-emerald-500/20';
      case 'rechazado':
        return 'bg-red-500/10 text-red-600 dark:bg-red-400/20 dark:text-red-400 border-red-500/20';
      default:
        return 'bg-amber-500/10 text-amber-600 dark:bg-amber-400/20 dark:text-amber-400 border-amber-500/20';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'resuelto':
        return 'Resuelto ✓';
      case 'rechazado':
        return 'Rechazado ✕';
      default:
        return 'En Proceso ⏳';
    }
  }
}
