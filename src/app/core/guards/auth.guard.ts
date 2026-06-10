import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {ITokenStore} from '../models/token-store.interface';

export const authGuard: CanActivateFn = () => {
  const tokenService = inject(ITokenStore);
  const router = inject(Router);
  // Read access token directly from localStorage for reliability in zoneless mode.
  // The signal-based isLoggedIn() may lag behind during XHR-triggered navigation.
  return tokenService.getAccessToken()
    ? true
    : router.createUrlTree(['/auth/login']);
};

