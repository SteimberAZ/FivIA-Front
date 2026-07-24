import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  public authService = inject(AuthService);
  private http = inject(HttpClient);

  stats = {
    conversations: 0,
    messages: 0,
    knowledgeFiles: 0,
    activeIntegrations: 0
  };
  isLoading = true;

  get userName(): string {
    return this.authService.currentUser()?.name || 'Steimber';
  }

  ngOnInit() {
    this.fetchStats();
  }

  fetchStats() {
    this.http.get(`${environment.apiUrl}/dashboard/stats`).subscribe({
      next: (data: any) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching dashboard stats', err);
        this.isLoading = false;
      }
    });
  }
}
