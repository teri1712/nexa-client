import { HttpInterceptorFn, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpBackend } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError, switchMap, throwError, EMPTY } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AccountResponse } from '../models/auth.models';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const backend = inject(HttpBackend);

  const token = tokenService.getAccessToken();
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const isRefresh = req.url.includes('/tokens/refresh');
      const isLogin = req.url.includes('/user-login');

      // If the 401 carries a business-logic detail (e.g. "Wrong password"),
      // it is NOT a token-expiry error — pass it straight to the caller.
      const hasProblemDetail = typeof error.error === 'object' && error.error?.detail;
      if (error.status === 401 && !isRefresh && !isLogin && !hasProblemDetail) {
        const refreshToken = tokenService.getRefreshToken();
        if (!refreshToken) {
          tokenService.clearSession();
          router.navigate(['/auth/login']);
          return EMPTY;
        }

        // Use HttpBackend to bypass interceptor chain for the refresh call
        const http = new HttpClient(backend);
        return http
          .post<AccountResponse>(`${environment.apiUrl}/tokens/refresh`, null, {
            headers: new HttpHeaders({ Authorization: `Bearer ${refreshToken}` }),
          })
          .pipe(
            switchMap(res => {
              tokenService.storeSession(res.profile, res.accessToken);
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${res.accessToken.accessToken}` },
              });
              return next(retryReq);
            }),
            catchError(() => {
              tokenService.clearSession();
              router.navigate(['/auth/login']);
              return EMPTY;
            }),
          );
      }
      return throwError(() => error);
    }),
  );
};

