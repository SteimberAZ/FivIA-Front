import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'chatbot-management',
    loadComponent: () => import('./features/chatbot-management/chatbot-management.component').then(m => m.ChatbotManagementComponent)
  },
  {
    path: 'knowledge-base',
    loadComponent: () => import('./features/knowledge-base/knowledge-base.component').then(m => m.KnowledgeBaseComponent)
  },
  {
    path: 'integrations',
    loadComponent: () => import('./features/integrations/integrations.component').then(m => m.IntegrationsComponent)
  },
  {
    path: 'live-chat',
    loadComponent: () => import('./features/live-chat/live-chat.component').then(m => m.LiveChatComponent)
  },
  {
    path: 'config',
    loadComponent: () => import('./features/config/config.component').then(m => m.ConfigComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
