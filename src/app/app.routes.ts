import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'live-chat',
    canActivate: [authGuard],
    loadComponent: () => import('./features/live-chat/live-chat.component').then(m => m.LiveChatComponent)
  },
  {
    path: 'tickets',
    canActivate: [authGuard],
    loadComponent: () => import('./features/tickets/tickets.component').then(m => m.TicketsComponent)
  },
  {
    path: 'knowledge-base',
    canActivate: [authGuard],
    loadComponent: () => import('./features/knowledge-base/knowledge-base.component').then(m => m.KnowledgeBaseComponent)
  },
  {
    path: 'integrations',
    canActivate: [authGuard],
    loadComponent: () => import('./features/integrations/integrations.component').then(m => m.IntegrationsComponent)
  },
  {
    path: 'chatbot-management',
    canActivate: [authGuard],
    loadComponent: () => import('./features/chatbot-management/chatbot-management.component').then(m => m.ChatbotManagementComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
