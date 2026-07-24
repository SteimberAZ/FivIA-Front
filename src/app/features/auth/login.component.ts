import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-950 text-slate-100 px-4 py-12">
      <!-- Background Dynamic Glow Spheres -->
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-fivia/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-[#34d399]/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

      <!-- Glassmorphism Container Card -->
      <div class="w-full max-w-md bg-white/10 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/15 dark:border-white/10 rounded-3xl p-8 shadow-2xl relative z-10">
        
        <!-- Brand Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center p-3 bg-fivia/10 rounded-2xl mb-4 border border-fivia/20 shadow-inner">
            <img src="assets/icono2.png" alt="FivIA Logo" class="w-12 h-12 floating" />
          </div>
          <h1 class="text-3xl font-extrabold font-outfit bg-clip-text text-transparent bg-gradient-to-r from-[#34d399] via-fivia-light to-[#10b981]">
            FivIA Platform
          </h1>
          <p class="text-xs text-slate-400 mt-2 font-medium">Inicia sesión con tu cuenta corporativa</p>
        </div>

        <!-- Error Alert -->
        <div *ngIf="errorMessage" class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3">
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onLogin()" class="space-y-5">
          <!-- Email Input -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-outfit">
              Correo Electrónico
            </label>
            <div class="relative">
              <input 
                type="email" 
                [(ngModel)]="email" 
                name="email" 
                required 
                placeholder="tu-correo@empresa.com"
                class="w-full px-4 py-3.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#34d399] focus:border-transparent transition-all text-sm"
              />
              <div class="absolute right-3 top-3.5 text-slate-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Password Input -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-outfit">
              Contraseña
            </label>
            <div class="relative">
              <input 
                type="password" 
                [(ngModel)]="password" 
                name="password" 
                required 
                placeholder="••••••••"
                class="w-full px-4 py-3.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#34d399] focus:border-transparent transition-all text-sm"
              />
              <div class="absolute right-3 top-3.5 text-slate-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            [disabled]="isLoading"
            class="w-full py-4 rounded-xl font-bold font-outfit text-slate-950 bg-gradient-to-r from-[#34d399] via-fivia-light to-[#10b981] hover:brightness-110 active:scale-[0.99] shadow-lg shadow-[#34d399]/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            <span *ngIf="!isLoading">Iniciar Sesión</span>
            <span *ngIf="isLoading" class="flex items-center gap-2">
              <svg class="animate-spin h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verificando...
            </span>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .floating {
      animation: float 3s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor ingresa tu correo y contraseña.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Credenciales inválidas. Verifica tu correo y contraseña.';
      }
    });
  }
}
