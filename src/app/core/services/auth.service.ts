import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, of, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl || 'http://localhost:3000';
  
  // Signal for reactive user state across components
  currentUser = signal<User | null>(this.getStoredUser());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/login`, { email, password }).pipe(
      tap(res => {
        if (res && res.user) {
          this.setSession(res.token, res.user);
        }
      }),
      catchError(err => {
        // Mock fallback for offline or standalone client testing with user Steimber
        if (email.toLowerCase().trim() === 'steimberaz19@gmail.com' && password === '12345678') {
          const mockUser: User = {
            id: '11111111-1111-1111-1111-111111111111',
            name: 'Steimber',
            email: 'steimberaz19@gmail.com'
          };
          const mockRes: AuthResponse = {
            message: 'Inicio de sesión exitoso',
            token: 'fivia-token-steimber-12345',
            user: mockUser
          };
          this.setSession(mockRes.token, mockRes.user);
          return of(mockRes);
        }
        throw err;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('fivia_token');
    localStorage.removeItem('fivia_user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('fivia_token') && !!this.currentUser();
  }

  getUser(): User | null {
    return this.currentUser();
  }

  private setSession(token: string, user: User): void {
    localStorage.setItem('fivia_token', token);
    localStorage.setItem('fivia_user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  private getStoredUser(): User | null {
    const userJson = localStorage.getItem('fivia_user');
    if (!userJson) return null;
    try {
      return JSON.parse(userJson) as User;
    } catch {
      return null;
    }
  }
}
