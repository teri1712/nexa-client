import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {TokenStore} from '../services/token-store.service';

export const adminGuard: CanActivateFn = () => {
  const tokenService = inject(TokenStore);
  const router = inject(Router);
  return tokenService.isAdmin() ? true : router.createUrlTree(['/profile']);
};

