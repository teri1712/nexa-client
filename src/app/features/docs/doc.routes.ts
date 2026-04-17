import {Routes} from '@angular/router';
import {SearchComponent} from './search/search.component';
import {adminGuard} from '../../core/guards/admin.guard';

export const docRoutes: Routes = [
      {
            path: '',
            component: SearchComponent,
      },
      {
            path: 'new',
            canActivate: [adminGuard],
            loadComponent: () => import('./upload-document/upload-document').then(m => m.UploadDocument),
      },
      {
            path: ':id',
            loadComponent: () => import('./document/document.component').then(m => m.DocumentComponent),
      }
];
