import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AccountResponse,
  AdminLoginRequest,
  SignUpRequest,
  ProfileResponse,
} from '../models/auth.models';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);
  private readonly base = environment.apiUrl;

  /** Google OIDC login – sends ID token via OIDC-Token header */
  loginWithOidc(idToken: string) {
    return this.http
      .post<AccountResponse>(`${this.base}/user-login`, null, {
        headers: new HttpHeaders({ 'OIDC-Token': idToken }),
      })
      .pipe(tap(res => this.tokenService.storeSession(res.profile, res.accessToken)));
  }

  /** Admin username/password login */
  loginWithCredentials(credentials: AdminLoginRequest) {
    return this.http
      .post<AccountResponse>(`${this.base}/user-login`, credentials)
      .pipe(tap(res => this.tokenService.storeSession(res.profile, res.accessToken)));
  }

  /** Register a new admin – requires active admin session */
  registerAdmin(data: SignUpRequest) {
    return this.http.post<ProfileResponse>(`${this.base}/admins`, data);
  }

  /** Refresh access token using the stored refresh token */
  refreshToken() {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.http
      .post<AccountResponse>(`${this.base}/tokens/refresh`, null, {
        headers: new HttpHeaders({ Authorization: `Bearer ${refreshToken}` }),
      })
      .pipe(tap(res => this.tokenService.storeSession(res.profile, res.accessToken)));
  }

  logout(): void {
    this.tokenService.clearSession();
    this.router.navigate(['/auth/login']);
  }
}

