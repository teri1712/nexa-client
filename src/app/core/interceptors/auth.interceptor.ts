import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, throwError} from 'rxjs';
import {AuthService} from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Inject the concrete AuthService — it IS the token store (extends TokenStore).
    // The interceptor is the only caller of token-mutation methods during auto-refresh.
    const tokenStore = inject(AuthService);

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

            // If the 401 carries a business-logic detail (e.g. "Wrong password"),
            // it is NOT a token-expiry error — pass it straight to the caller.
            const hasProblemDetail = typeof error.error === 'object' && error.error?.detail;
            if (error.status === 401 && !isRefresh && !hasProblemDetail && token) {
                tokenStore.markSessionExpired();
            }
            return throwError(() => error);
        }),
    );
};

