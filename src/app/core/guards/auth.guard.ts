import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {TokenStore} from '../services/token-store.service';

export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenStore);
  const router = inject(Router);
  // Read access token directly from localStorage for reliability in zoneless mode.
  // The signal-based isLoggedIn() may lag behind during XHR-triggered navigation.
  return tokenService.getAccessToken()
    ? true
    : router.createUrlTree(['/auth/login']);
};

