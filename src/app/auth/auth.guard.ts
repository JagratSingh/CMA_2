import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const canActivateAdmin = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAdmin()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const canActivateEmployee = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isEmployee()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

