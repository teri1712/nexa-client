import {computed, Injectable, signal} from '@angular/core';
import {AccessToken, ProfileResponse} from '../models/auth.models';
import {ITokenStore} from '../models/token-store.interface';

const KEYS = {
  ACCESS: 'nexa_access_token',
  REFRESH: 'nexa_refresh_token',
  PROFILE: 'nexa_profile',
} as const;

@Injectable()
export class TokenStore implements ITokenStore {
  private readonly _profile = signal<ProfileResponse | null>(this._loadProfile());
  private readonly _sessionExpired = signal(false);

  readonly profile = this._profile.asReadonly();
  readonly isLoggedIn = computed(() => !!this._profile());
  readonly isAdmin = computed(() => this._profile()?.role === 'ADMIN');
  /** True when the server has invalidated the refresh token. */
  readonly sessionExpired = this._sessionExpired.asReadonly();

  storeSession(profile: ProfileResponse, tokens: AccessToken): void {
    localStorage.setItem(KEYS.ACCESS, tokens.accessToken);
    localStorage.setItem(KEYS.REFRESH, tokens.refreshToken);
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    this._profile.set(profile);
    this._sessionExpired.set(false);
  }

  /** Only update the access token (used after token refresh — profile stays the same). */
  updateAccessToken(accessToken: string): void {
    localStorage.setItem(KEYS.ACCESS, accessToken);
  }

  updateProfile(profile: ProfileResponse): void {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    this._profile.set(profile);
  }

  clearSession(): void {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    this._profile.set(null);
    this._sessionExpired.set(false);
  }

  /** Signal that the server-side session is gone (refresh token invalidated). */
  markSessionExpired(): void {
    this._sessionExpired.set(true);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(KEYS.ACCESS);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(KEYS.REFRESH);
  }

  private _loadProfile(): ProfileResponse | null {
    const raw = localStorage.getItem(KEYS.PROFILE);
    try {
      return raw ? (JSON.parse(raw) as ProfileResponse) : null;
    } catch {
      return null;
    }
  }
}

