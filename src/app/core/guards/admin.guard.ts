import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {IProfileStore} from '../models/token-store.interface';

export const adminGuard: CanActivateFn = () => {
    const profileStore = inject(IProfileStore);
    const router = inject(Router);
    return profileStore.isAdmin() ? true : router.createUrlTree(['/profile']);
};

