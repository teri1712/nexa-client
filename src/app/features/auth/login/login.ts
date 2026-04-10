import {AfterViewInit, Component, inject, NgZone, OnDestroy, OnInit, signal,} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {AuthService} from '../../../core/services/auth.service';
import {TokenStore} from '../../../core/services/token-store.service';
import {ProblemDetail} from '../../../core/models/auth.models';
import {environment} from '../../../../environments/environment';

// Google Identity Services global type
declare const google: {
  accounts: {
    id: {
      initialize(cfg: object): void;
      renderButton(el: HTMLElement, cfg: object): void;
      prompt(): void;
    };
  };
};

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenStore);
  private readonly router = inject(Router);
  private readonly ngZone = inject(NgZone);

  protected readonly showAdminForm = signal(false);
  protected readonly isGoogleLoading = signal(false);
  protected readonly isAdminLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly googleScriptReady = signal(false);

  protected readonly adminForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
    password: ['', [Validators.required]],
  });

  ngOnInit(): void {
    if (this.tokenService.isLoggedIn()) {
      this.router.navigate(['/profile']);
    }
  }

  ngAfterViewInit(): void {
    this.waitForGoogleScript();
  }

  ngOnDestroy(): void {
  }

  private waitForGoogleScript(retries = 20): void {
    if (typeof google !== 'undefined') {
      this.googleScriptReady.set(true);
      this.initGoogleSignIn();
      return;
    }
    if (retries > 0) {
      setTimeout(() => this.waitForGoogleScript(retries - 1), 300);
    }
  }

  private initGoogleSignIn(): void {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: { credential: string }) => {
        this.ngZone.run(() => this.handleGoogleCredential(response.credential));
      },
      auto_select: false,
    });

    const btn = document.getElementById('google-signin-btn');
    if (btn) {
      google.accounts.id.renderButton(btn, {
        theme: 'outline',
        size: 'large',
        width: btn.offsetWidth || 360,
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
      });
    }
  }

  private handleGoogleCredential(idToken: string): void {
    this.isGoogleLoading.set(true);
    this.errorMessage.set(null);

    this.authService.loginWithOidc(idToken).subscribe({
      next: () => this.router.navigate(['/profile']),
      error: (err: HttpErrorResponse) => {
        this.isGoogleLoading.set(false);
        this.errorMessage.set(this.extractError(err));
      },
    });
  }

  protected toggleAdminForm(): void {
    this.showAdminForm.update(v => !v);
    this.errorMessage.set(null);
    this.adminForm.reset();
  }

  protected submitAdminLogin(): void {
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }
    this.isAdminLoading.set(true);
    this.errorMessage.set(null);

    const {username, password} = this.adminForm.value;
    this.authService
      .loginWithCredentials({username: username!, password: password!})
      .subscribe({
        next: () => this.router.navigate(['/profile']),
        error: (err: HttpErrorResponse) => {
          this.isAdminLoading.set(false);
          this.errorMessage.set(this.extractError(err));
        },
      });
  }

  private extractError(err: HttpErrorResponse): string {
    const p = err.error as ProblemDetail;
    return p?.detail ?? p?.title ?? 'Something went wrong. Please try again.';
  }

  get usernameCtrl() {
    return this.adminForm.get('username')!;
  }

  get passwordCtrl() {
    return this.adminForm.get('password')!;
  }
}

