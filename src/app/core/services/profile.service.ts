import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ProfileRequest, ProfileResponse} from '../models/auth.models';
import {TokenStore} from './token-store.service';

@Injectable({providedIn: 'root'})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenStore);
  private readonly base = environment.apiUrl;

  getProfile() {
    return this.http
      .get<ProfileResponse>(`${this.base}/profiles/me`)
      .pipe(tap(profile => this.tokenService.updateProfile(profile)));
  }

  updateProfile(data: ProfileRequest) {
    return this.http
      .patch<ProfileResponse>(`${this.base}/profiles/me`, data)
      .pipe(tap(profile => this.tokenService.updateProfile(profile)));
  }

  changePassword(newPassword: string, currentPassword?: string) {
    const params: Record<string, string> = {new_password: newPassword};
    if (currentPassword) params['password'] = currentPassword;
    return this.http.post<ProfileResponse>(`${this.base}/profiles/me/password`, null, {params});
  }
}

