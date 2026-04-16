import {AfterViewInit, Component, computed, effect, inject, NgZone, OnDestroy, OnInit, signal,} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {IAuthService} from '../../../core/models/auth-service.interface';
import {ITokenStore} from '../../../core/models/token-store.interface';
import {ProblemDetail} from '../../../core/models/auth.models';
import {environment} from '../../../../environments/environment';
import {timer} from "rxjs";

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
      private readonly authService = inject(IAuthService);
      private readonly tokenService = inject(ITokenStore);
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
      private viewReady = signal(false);
      private googleButtonReady = computed(() => this.viewReady() && !this.showAdminForm());

      constructor() {
            effect(() => {
                  if (this.googleButtonReady()) {
                        this.waitForGoogleScript();
                  }
            });
      }


      ngAfterViewInit(): void {
            this.viewReady.set(true);
      }

      ngOnInit(): void {
            if (this.tokenService.isLoggedIn()) {
                  this.router.navigate(['/profile']);
            }
      }

      ngOnDestroy(): void {
      }

      private waitForGoogleScript(retries = 20): void {
            if (!!(window as any).google) {
                  this.googleScriptReady.set(true);
                  this.initGoogleSignIn();
                  return;
            }
            if (retries > 0) {
                  timer(300).subscribe(() =>
                          this.waitForGoogleScript(retries - 1));
            }
      }

      private initGoogleSignIn(): void {
            const g = (window as any).google;
            g.accounts.id.initialize({
                  client_id: environment.googleClientId,
                  callback: (response: { credential: string }) => {
                        this.ngZone.run(() => this.handleGoogleCredential(response.credential));
                  },
                  auto_select: false,
            });

            const btn = document.getElementById('google-signin-btn');
            if (btn) {
                  g.accounts.id.renderButton(btn, {
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
