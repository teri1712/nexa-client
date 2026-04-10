import {Component, effect, inject} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TokenStore} from './core/services/token-store.service';
import {AuthService} from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly tokenService = inject(TokenStore);
  protected readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    effect(() => {
      if (this.tokenService.sessionExpired()) {
        const ref = this.snackBar.open('Your session has expired', 'Sign out', {
          duration: 0,
          panelClass: 'session-expired-snackbar',
        });
        ref.onAction().subscribe(() => this.authService.logout());
      }
    });
  }
}
