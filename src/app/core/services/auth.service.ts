import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AccountResponse, AdminLoginRequest, ProfileResponse, SignUpRequest,} from '../models/auth.models';
import {TokenStore} from './token-store.service';

@Injectable({providedIn: 'root'})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenStore = inject(TokenStore);
  private readonly base = environment.apiUrl;

  /** Google OIDC login – sends ID token via OIDC-Token header */
  loginWithOidc(idToken: string) {
    return this.http
      .post<AccountResponse>(`${this.base}/tokens/oauth2`, null, {
        headers: {'OIDC-Token': idToken},
      })
      .pipe(tap(res => this.tokenStore.storeSession(res.profile, res.accessToken)));
  }

  /** Admin username/password login */
  loginWithCredentials(credentials: AdminLoginRequest) {
    return this.http
      .post<AccountResponse>(`${this.base}/user-login`, credentials)
      .pipe(tap(res => this.tokenStore.storeSession(res.profile, res.accessToken)));
  }

  /** Register a new admin – requires active admin session */
  registerAdmin(data: SignUpRequest) {
    return this.http.post<ProfileResponse>(`${this.base}/admins`, data);
  }

  /**
   * Logout: notifies the server to invalidate the refresh token,
   * then clears the local session and navigates to login.
   */
  logout(): void {
    const refreshToken = this.tokenStore.getRefreshToken();
    if (refreshToken) {
      // Fire-and-forget: inform server to revoke the refresh token
      this.http
        .post(`${this.base}/logout?refresh_token=${encodeURIComponent(refreshToken)}`, null)
        .subscribe({error: () => {}});
    }
    this.tokenStore.clearSession();
    this.router.navigate(['/auth/login']);
  }
}

