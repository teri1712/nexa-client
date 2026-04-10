import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AccountResponse, AdminLoginRequest, ProfileResponse, SignUpRequest} from '../models/auth.models';
import {IAuthService} from '../models/auth-service.interface';
import {TokenStore} from './token-store.service';

/**
 * Single class responsible for all auth operations AND token storage.
 * Extending TokenStore means AuthService IS the token store — there is only
 * one instance managing session state.
 * Components never inject this class directly; they use IAuthService / ITokenStore.
 */
@Injectable({providedIn: 'root'})
export class AuthService extends TokenStore implements IAuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly base = environment.apiUrl;

  /** Google OIDC login – sends ID token via OIDC-Token header */
  loginWithOidc(idToken: string) {
    return this.http
      .post<AccountResponse>(`${this.base}/tokens/oauth2`, null, {
        headers: {'OIDC-Token': idToken},
      })
      .pipe(tap(res => this.storeSession(res.profile, res.accessToken)));
  }

  /** Admin username/password login */
  loginWithCredentials(credentials: AdminLoginRequest) {
    return this.http
      .post<AccountResponse>(`${this.base}/user-login`, credentials)
      .pipe(tap(res => this.storeSession(res.profile, res.accessToken)));
  }

  /** Register a new admin – requires an active admin session */
  registerAdmin(data: SignUpRequest) {
    return this.http.post<ProfileResponse>(`${this.base}/admins`, data);
  }

  /**
   * Logout: sends refresh token as form-encoded body so the server can invalidate it,
   * then clears the local session and navigates to login.
   */
  logout(): void {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      const body = new HttpParams().set('refresh_token', refreshToken);
      this.http
        .post(`${this.base}/logout`, body)
        .subscribe({error: () => {}});
    }
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }
}

