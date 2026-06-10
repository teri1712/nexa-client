import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {ITokenStore} from '../models/token-store.interface';

export const adminGuard: CanActivateFn = () => {
  const tokenService = inject(ITokenStore);
  const router = inject(Router);
  return tokenService.isAdmin() ? true : router.createUrlTree(['/profile']);
};

