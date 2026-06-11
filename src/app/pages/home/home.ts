import {Component, effect, inject, signal, untracked} from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {IAuthService} from "../../core/models/auth-service.interface";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatToolbar} from "@angular/material/toolbar";
import {IProfileStore, ITokenStore} from "../../core/models/token-store.interface";
import {ThemeService} from "../../core/services/theme.service";
import {ProfileService} from "../../core/services/profile.service";
import {SplashScreenComponent} from "../../features/splash-screen/splash-screen";

@Component({
    selector: 'app-home',
    imports: [MatChipsModule, MatButton, MatIcon, MatSidenav, MatSidenavContainer, MatSidenavContent, MatToolbar, RouterLink, RouterLinkActive, RouterOutlet, SplashScreenComponent],
    templateUrl: './home.html',
    styleUrl: './home.scss',
})
export class HomeComponent {
    private readonly router = inject(Router)
    private readonly snackBar = inject(MatSnackBar);
    private readonly authService = inject(IAuthService)
    protected readonly tokenService = inject(ITokenStore);
    protected readonly profileStore = inject(IProfileStore);
    protected readonly themeService = inject(ThemeService);
    private readonly profileService = inject(ProfileService)
    protected readonly chatOpen = signal(false);

    protected splash = signal(true)

    getThemeIcon(mode: string): string {
        switch (mode) {
            case 'light':
                return 'light_mode';
            case 'dark':
                return 'dark_mode';
            default:
                return 'brightness_auto';
        }
    }

    constructor() {
        effect(() => {
            if (this.tokenService.sessionExpired()) {
                const ref = this.snackBar.open('Your session has expired', 'Sign out', {
                    duration: 0,
                    panelClass: 'session-expired-snackbar',
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                });
                ref.onAction().subscribe(() => this.authService.logout());
            }
        });
        effect(() => {
            if (!this.tokenService.isLoggedIn()) {
                untracked(() => {
                    this.splash.set(false)
                })
            } else {
                this.profileService.getFreshProfile().subscribe({
                    next: () => {
                        this.splash.set(false)
                    },
                    error: (err) => {
                        console.error(err)
                        this.splash.set(false)
                    }
                })
            }
        });
    }


    logout() {
        this.authService.logout()
    }
}

