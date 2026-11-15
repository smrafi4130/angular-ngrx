import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/tasks/tasks-page.component').then((m) => m.TasksPageComponent),
  },
  { path: '**', redirectTo: '' },
];
