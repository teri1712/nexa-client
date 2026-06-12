import {Routes} from '@angular/router';
import {authGuard} from './core/guards/auth.guard';
import {adminGuard} from './core/guards/admin.guard';
import {FileService} from "./core/services/file.service";
import {DocService} from "./core/services/doc.service";
import {ProfileService} from "./core/services/profile.service";
import {HomeComponent} from "./pages/home/home";
import {DocDashboardComponent} from "./features/docs/dashboard/doc-dashboard.component";

export const routes: Routes = [
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
        path: 'home',
        component: HomeComponent,
        providers: [ProfileService],
        children: [
            {
                path: 'profile',
                canActivate: [authGuard],
                loadComponent: () =>
                    import('./features/profile/profile').then(m => m.ProfileComponent),
            },
            {
                path: 'docs',
                providers: [DocService, FileService],
                component: DocDashboardComponent,
                loadChildren: () => import('./features/docs/doc.routes').then(m => m.docRoutes)
            },
        ]
    },
    {
        path: '',
        redirectTo: '/home/docs/dashboard',
        pathMatch: 'full'
    }
];
