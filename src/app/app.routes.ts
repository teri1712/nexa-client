import {Routes} from '@angular/router';
import {authGuard} from './core/guards/auth.guard';
import {adminGuard} from './core/guards/admin.guard';
import {FileService} from "./core/services/file.service";
import {DocService} from "./core/services/doc.service";
import {ProfileService} from "./core/services/profile.service";
import {MessageService} from "./core/services/message.service";

export const routes: Routes = [
      {
            path: '',
            canActivate: [authGuard],
            loadComponent: () =>
                    import('./pages/home/home').then(m => m.HomeComponent),
      },
      {
            path: 'auth',
            children: [
                  {
                        path: 'login',
                        loadComponent: () =>
                                import('./features/auth/login/login').then(m => m.LoginComponent),
                  },
                  {
                        path: 'register-admin',
                        canActivate: [authGuard, adminGuard],
                        loadComponent: () =>
                                import('./features/auth/register-admin/register-admin').then(
                                        m => m.RegisterAdminComponent,
                                ),
                  },
                  {path: '', redirectTo: 'login', pathMatch: 'full'},
            ],
      },
      {
            path: 'profile',
            canActivate: [authGuard],
            providers: [ProfileService],
            loadComponent: () =>
                    import('./features/profile/profile').then(m => m.ProfileComponent),
      },
      {
            path: 'docs',
            canActivate: [authGuard],
            providers: [DocService, FileService],
            loadComponent: () => import('./features/docs/dashboard/doc-dashboard.component').then(m => m.DocDashboardComponent),
            loadChildren: () => import('./features/docs/doc.routes').then(m => m.docRoutes)
      },
      {
            path: 'messages',
            canActivate: [authGuard],
            outlet: 'right',
            providers: [MessageService],
            loadComponent: () => import('./features/message-list/message-list.component').then(m => m.MessageListComponent),
      },
      {path: '**', redirectTo: ''},
];
