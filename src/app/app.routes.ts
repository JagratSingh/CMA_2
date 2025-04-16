import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from '../app/auth/login/login.component';
import { AdminDashboardComponent } from '../app/admin/admin.component';
import { EmployeeDashboardComponent } from '../app/employee/employee.component';
import { AuthService } from './auth/auth.service';
import { canActivateAdmin, canActivateEmployee } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    children: [
      {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [canActivateAdmin],
      },
      {
        path: 'employee',
        component: EmployeeDashboardComponent,
        canActivate: [canActivateEmployee],
      },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
