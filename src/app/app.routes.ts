import {Routes} from '@angular/router';
import {authGuard} from './core/guards/auth.guard';
import {adminGuard} from './core/guards/admin.guard';

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
            loadComponent: () =>
                    import('./features/profile/profile').then(m => m.ProfileComponent),
      },
      {
            path: 'docs/dashboard',
            canActivate: [authGuard],
            loadComponent: () => import('./features/docs/dashboard/doc-dashboard.component').then(m => m.DocDashboardComponent),
            loadChildren: () => import('./features/docs/doc.routes').then(m => m.docRoutes)
      },
      {path: '**', redirectTo: ''},
];
