import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 p-4 sm:p-6 md:p-10 font-sans selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-300">
      
      <!-- Floating Top-Right Theme Toggle Button -->
      <button 
        (click)="themeService.toggleTheme()" 
        type="button"
        title="Cambiar Modo Claro/Oscuro"
        class="fixed top-5 right-5 z-50 p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-amber-400 hover:scale-105 active:scale-95 transition-all shadow-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        <svg *ngIf="themeService.isDarkMode()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <svg *ngIf="!themeService.isDarkMode()" class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>

      <!-- Background Ambient Glow & Mesh Elements -->
      <div class="absolute -top-32 -left-32 w-96 h-96 bg-fivia/25 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>
      <div class="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-[#34d399]/20 rounded-full blur-[160px] pointer-events-none animate-pulse"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[180px] pointer-events-none"></div>

      <!-- Main Container: Split Hero Grid -->
      <div class="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        <!-- LEFT COLUMN: Value Proposition & Brand Copy (Hidden on Mobile/Tablet for max simplicity) -->
        <div class="hidden lg:flex lg:col-span-7 flex-col justify-center space-y-6 text-left animate-fade-in">
          
          <!-- Pill Tag -->
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md self-start shadow-sm">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span class="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-outfit">FivIA conoce tu negocio</span>
          </div>

          <!-- Main Title (Crystal clear, non-faded text) -->
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-outfit tracking-tight leading-tight text-gray-900 dark:text-white">
            No vuelvas a <span class="text-emerald-600 dark:text-[#34d399] font-extrabold underline decoration-emerald-500/30 decoration-wavy">perder un cliente</span> por responder tarde.
          </h1>

          <!-- Value Copy -->
          <p class="text-sm sm:text-base text-gray-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl">
            <strong class="text-gray-900 dark:text-white font-semibold">FivIA</strong> es la plataforma omnicanal impulsada por Inteligencia Artificial que aprende la base de conocimiento de tu empresa y atiende a tus clientes en tiempo real 24/7.
          </p>

          <!-- Feature Bullets Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            
            <div class="p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md flex flex-col items-start hover:border-emerald-500/30 transition-all shadow-sm">
              <div class="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3 border border-emerald-500/20">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h4 class="text-sm font-bold text-gray-900 dark:text-white font-outfit">Respuestas 24/7</h4>
              <p class="text-xs text-gray-500 dark:text-slate-400 mt-1">Atención inmediata sin tiempos de espera.</p>
            </div>

            <div class="p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md flex flex-col items-start hover:border-emerald-500/30 transition-all shadow-sm">
              <div class="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3 border border-emerald-500/20">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <h4 class="text-sm font-bold text-gray-900 dark:text-white font-outfit">Conoce tu Negocio</h4>
              <p class="text-xs text-gray-500 dark:text-slate-400 mt-1">IA entrenada con tus documentos y datos.</p>
            </div>

            <div class="p-4 rounded-2xl bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md flex flex-col items-start hover:border-emerald-500/30 transition-all shadow-sm">
              <div class="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3 border border-emerald-500/20">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h4 class="text-sm font-bold text-gray-900 dark:text-white font-outfit">Handoff Humano</h4>
              <p class="text-xs text-gray-500 dark:text-slate-400 mt-1">Interviene en los chats en un solo clic.</p>
            </div>

          </div>

          <!-- Social Trust Quote -->
          <div class="pt-4 flex items-center justify-start gap-4 text-xs text-gray-500 dark:text-slate-400">
            <div class="flex -space-x-2">
              <div class="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold border-2 border-white dark:border-slate-950">S</div>
              <div class="w-7 h-7 rounded-full bg-teal-500 flex items-center justify-center text-slate-950 font-bold border-2 border-white dark:border-slate-950">F</div>
              <div class="w-7 h-7 rounded-full bg-emerald-400 flex items-center justify-center text-slate-950 font-bold border-2 border-white dark:border-slate-950">A</div>
            </div>
            <span>Potenciando la atención en Telegram y canales digitales.</span>
          </div>

        </div>

        <!-- RIGHT COLUMN: High-End Glassmorphism Login Card -->
        <div class="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none animate-scale-up">
          <div class="w-full bg-white/80 dark:bg-slate-900/70 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 sm:p-9 shadow-2xl relative overflow-hidden">
            
            <!-- Top Light Flare inside Card -->
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#34d399] to-transparent opacity-50"></div>

            <!-- Header -->
            <div class="text-center mb-7">
              <div class="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl mb-3 border border-emerald-500/20 shadow-inner">
                <img src="assets/icono2.png" alt="FivIA" class="w-10 h-10 floating" />
              </div>
              <h2 class="text-2xl font-extrabold font-outfit text-emerald-600 dark:text-[#34d399]">
                FivIA Platform
              </h2>
              <p class="text-xs text-gray-500 dark:text-slate-400 mt-1 font-medium">Accede a tu panel de administración</p>
            </div>

            <!-- Error Alert -->
            <div *ngIf="errorMessage" class="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-xs flex items-center gap-3">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ errorMessage }}</span>
            </div>

            <!-- Form -->
            <form (ngSubmit)="onLogin()" class="space-y-4">
              <!-- Email Input -->
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-outfit">
                  Correo Electrónico
                </label>
                <div class="relative">
                  <input 
                    type="email" 
                    [(ngModel)]="email" 
                    name="email" 
                    required 
                    placeholder="tu-correo@empresa.com"
                    class="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-slate-950/80 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#34d399] focus:border-transparent transition-all text-sm min-h-[44px]"
                  />
                  <div class="absolute right-3.5 top-3.5 text-gray-400 dark:text-slate-500 pointer-events-none">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Password Input -->
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-outfit">
                  Contraseña
                </label>
                <div class="relative">
                  <input 
                    type="password" 
                    [(ngModel)]="password" 
                    name="password" 
                    required 
                    placeholder="••••••••"
                    class="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-slate-950/80 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#34d399] focus:border-transparent transition-all text-sm min-h-[44px]"
                  />
                  <div class="absolute right-3.5 top-3.5 text-gray-400 dark:text-slate-500 pointer-events-none">
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
                class="w-full mt-2 py-4 min-h-[44px] rounded-xl font-bold font-outfit text-slate-950 bg-gradient-to-r from-[#34d399] via-emerald-300 to-[#10b981] hover:brightness-110 active:scale-[0.99] shadow-lg shadow-[#34d399]/25 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                <span *ngIf="!isLoading" class="flex items-center gap-2">
                  Ingresar a FivIA
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </span>
                <span *ngIf="isLoading" class="flex items-center gap-2">
                  <svg class="animate-spin h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Autenticando...
                </span>
              </button>
            </form>

            <!-- Bottom Subtext -->
            <div class="mt-6 text-center text-xs text-gray-400 dark:text-slate-500">
              Protegido con encriptación de extremo a extremo & Supabase
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .floating {
      animation: float 3.5s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  public themeService = inject(ThemeService);
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
