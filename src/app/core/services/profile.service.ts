import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ProfileRequest, ProfileResponse} from '../models/auth.models';
import {TokenStore} from "./token-store.service";

@Injectable()
export class ProfileService {
    private readonly http = inject(HttpClient);
    private readonly profileStore = inject(TokenStore);
    private readonly base = environment.apiUrl;

    getFreshProfile() {
        return this.http
            .get<ProfileResponse>(`${this.base}/profiles/me`)
            .pipe(tap(profile => this.profileStore.updateProfile(profile)));
    }

    updateProfile(data: ProfileRequest) {
        return this.http
            .patch<ProfileResponse>(`${this.base}/profiles/me`, data)
            .pipe(tap(profile => this.profileStore.updateProfile(profile)));
    }


}

