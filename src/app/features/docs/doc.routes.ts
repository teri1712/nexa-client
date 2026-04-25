import {Routes} from '@angular/router';
import {adminGuard} from '../../core/guards/admin.guard';

export const docRoutes: Routes = [
    {
        path: 'dashboard',
        loadComponent: () => import('./search/search.component').then(m => m.SearchComponent),
    },
    {
        path: 'new',
        canActivate: [adminGuard],
        loadComponent: () => import('./upload-document/upload-document').then(m => m.UploadDocument),
    },
    {
        path: ':id',
        loadComponent: () => import('./document/document.component').then(m => m.DocumentComponent),
    },
];
