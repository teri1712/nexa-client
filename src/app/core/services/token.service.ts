import { Injectable, signal, computed } from '@angular/core';
import { AccessToken, ProfileResponse } from '../models/auth.models';

const KEYS = {
  ACCESS: 'nexa_access_token',
  REFRESH: 'nexa_refresh_token',
  PROFILE: 'nexa_profile',
} as const;

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly _profile = signal<ProfileResponse | null>(this._loadProfile());

  readonly profile = this._profile.asReadonly();
  readonly isLoggedIn = computed(() => !!this._profile());
  readonly isAdmin = computed(() => this._profile()?.role === 'ADMIN');

  storeSession(profile: ProfileResponse, tokens: AccessToken): void {
    localStorage.setItem(KEYS.ACCESS, tokens.accessToken);
    localStorage.setItem(KEYS.REFRESH, tokens.refreshToken);
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    this._profile.set(profile);
  }

  updateProfile(profile: ProfileResponse): void {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    this._profile.set(profile);
  }

  clearSession(): void {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    this._profile.set(null);
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

