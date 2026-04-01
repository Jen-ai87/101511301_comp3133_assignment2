import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () => import('./components/signup/signup.component').then(m => m.SignupComponent),
  },
  {
    path: 'employees',
    loadComponent: () => import('./components/employee-list/employee-list.component').then(m => m.EmployeeListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'employees/add',
    loadComponent: () => import('./components/employee-add/employee-add.component').then(m => m.EmployeeAddComponent),
    canActivate: [authGuard],
  },
  {
    path: 'employees/edit/:id',
    loadComponent: () => import('./components/employee-edit/employee-edit.component').then(m => m.EmployeeEditComponent),
    canActivate: [authGuard],
  },
  {
    path: 'employees/:id',
    loadComponent: () => import('./components/employee-detail/employee-detail.component').then(m => m.EmployeeDetailComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'login' },
];
