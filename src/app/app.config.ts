import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { ITokenStore } from './core/models/token-store.interface';
import { IAuthService } from './core/models/auth-service.interface';
import { TokenStore } from './core/services/token-store.service';
import { AuthService } from './core/services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideAnimationsAsync(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    // AuthService extends TokenStore — it is the single owner of session state.
    // All three tokens resolve to the same AuthService singleton.
    { provide: TokenStore, useExisting: AuthService },
    { provide: ITokenStore, useExisting: AuthService },
    { provide: IAuthService, useExisting: AuthService },
  ],
};
