import {Routes} from '@angular/router';
import {adminGuard} from '../../core/guards/admin.guard';
import {authGuard} from "../../core/guards/auth.guard";
import {MessageService} from "../../core/services/message.service";

export const docRoutes: Routes = [
    {
        path: 'dashboard',
        loadComponent: () => import('./search/search.component').then(m => m.SearchComponent),
    },
    {
        path: 'new',
        canActivate: [authGuard, adminGuard],
        loadComponent: () => import('./upload-document/upload-document').then(m => m.UploadDocument),
    },
    {
        path: ':docId',
        loadComponent: () => import('./document/document.component').then(m => m.DocumentComponent),
        children: [
            {
                path: 'messages',
                outlet: 'right',
                runGuardsAndResolvers: 'always',
                canActivate: [authGuard],
                providers: [MessageService],
                loadComponent: () => import('../message-list/message-list.component').then(m => m.MessageListComponent),
            },
        ]
    },
];
