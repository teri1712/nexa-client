import {HttpBackend, HttpClient, HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, EMPTY, switchMap, throwError} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {AccountResponse} from '../models/auth.models';
import {environment} from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inject the concrete AuthService — it IS the token store (extends TokenStore).
  // The interceptor is the only caller of token-mutation methods during auto-refresh.
  const tokenStore = inject(AuthService);
  const backend = inject(HttpBackend);

  // Skip refresh retry if session is already known expired
  if (tokenStore.sessionExpired()) {
    return next(req);
  }

  const token = tokenStore.getAccessToken();
  const authReq = token
    ? req.clone({setHeaders: {Authorization: `Bearer ${token}`}})
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const isRefresh = req.url.includes('/tokens/refresh');
      const isLogin = req.url.includes('/user-login');

      // If the 401 carries a business-logic detail (e.g. "Wrong password"),
      // it is NOT a token-expiry error — pass it straight to the caller.
      const hasProblemDetail = typeof error.error === 'object' && error.error?.detail;
      if (error.status === 401 && !isRefresh && !isLogin && !hasProblemDetail) {
        const refreshToken = tokenStore.getRefreshToken();
        if (!refreshToken) {
          tokenStore.markSessionExpired();
          return EMPTY;
        }

        // Use HttpBackend to bypass interceptor chain for the refresh call
        const http = new HttpClient(backend);
        return http
          .post<AccountResponse>(
            `${environment.apiUrl}/tokens/refresh?refresh_token=${encodeURIComponent(refreshToken)}`,
            null,
          )
          .pipe(
            switchMap(res => {
              tokenStore.updateAccessToken(res.accessToken.accessToken);
              const retryReq = req.clone({
                setHeaders: {Authorization: `Bearer ${res.accessToken.accessToken}`},
              });
              return next(retryReq);
            }),
            catchError(() => {
              // Refresh token is invalid/expired — notify app via signal
              tokenStore.markSessionExpired();
              return EMPTY;
            }),
          );
      }
      return throwError(() => error);
    }),
  );
};

