import {Component, computed, inject, OnInit, signal,} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSliderModule} from '@angular/material/slider';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {ProfileService} from '../../core/services/profile.service';
import {ITokenStore} from '../../core/models/token-store.interface';
import {IAuthService} from '../../core/models/auth-service.interface';
import {ProblemDetail} from '../../core/models/auth.models';

type Tab = 'profile' | 'security';

@Component({
      selector: 'app-profile',
      imports: [
            ReactiveFormsModule,
            MatCardModule,
            MatTabsModule,
            MatFormFieldModule,
            MatInputModule,
            MatButtonModule,
            MatProgressSpinnerModule,
            MatSliderModule,
            MatChipsModule,
            MatIconModule,
      ],
      templateUrl: './profile.html',
      styleUrl: './profile.scss',
})
export class ProfileComponent implements OnInit {
      private readonly fb = inject(FormBuilder);
      private readonly profileService = inject(ProfileService);
      private readonly authService = inject(IAuthService);
      readonly tokenService = inject(ITokenStore);

      protected readonly activeTab = signal<Tab>('profile');
      protected readonly isProfileLoading = signal(false);
      protected readonly isPasswordLoading = signal(false);
      protected readonly profileSuccess = signal<string | null>(null);
      protected readonly profileError = signal<string | null>(null);
      protected readonly passwordSuccess = signal<string | null>(null);
      protected readonly passwordError = signal<string | null>(null);

      protected readonly profile = this.tokenService.profile;
      protected readonly isAdmin = this.tokenService.isAdmin;

      protected readonly avatarInitials = computed(() => {
            const name = this.profile()?.name ?? '';
            return name
                    .split(' ')
                    .map(w => w[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();
      });

      protected readonly profileForm = this.fb.group({
            name: ['', [Validators.required, Validators.pattern(/\S.*/)]],
            gender: [0.5, [Validators.required, Validators.min(0), Validators.max(1)]],
            dob: [null as string | null],
      });

      protected readonly passwordForm = this.fb.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required]],
      });

      protected readonly genderLabel = computed(() => {
            const v = this.profileForm.get('gender')?.value ?? 0.5;
            if (v <= 0.1) return 'Male';
            if (v <= 0.4) return 'More masculine';
            if (v <= 0.6) return 'Non-binary';
            if (v <= 0.9) return 'More feminine';
            return 'Female';
      });

      ngOnInit(): void {
            const p = this.profile();
            if (p) {
                  this.profileForm.patchValue({
                        name: p.name,
                        gender: this.parseGender(p.gender),
                        dob: p.dob ? p.dob.substring(0, 10) : null,
                  });
            }
      }

      protected setTab(tab: Tab): void {
            this.activeTab.set(tab);
            this.profileSuccess.set(null);
            this.profileError.set(null);
            this.passwordSuccess.set(null);
            this.passwordError.set(null);
      }

      protected saveProfile(): void {
            if (this.profileForm.invalid) {
                  this.profileForm.markAllAsTouched();
                  return;
            }
            this.isProfileLoading.set(true);
            this.profileSuccess.set(null);
            this.profileError.set(null);

            const {name, gender, dob} = this.profileForm.value;
            this.profileService
                    .updateProfile({
                          name: name ?? undefined,
                          gender: gender ?? undefined,
                          dob: dob ? new Date(dob).toISOString() : undefined,
                    })
                    .subscribe({
                          next: () => {
                                this.isProfileLoading.set(false);
                                this.profileSuccess.set('Profile updated successfully.');
                          },
                          error: (err: HttpErrorResponse) => {
                                this.isProfileLoading.set(false);
                                this.profileError.set(this.extractError(err));
                          },
                    });
      }

      protected savePassword(): void {
            if (this.passwordForm.invalid) {
                  this.passwordForm.markAllAsTouched();
                  return;
            }
            const {currentPassword, newPassword, confirmPassword} = this.passwordForm.value;

            if (newPassword !== confirmPassword) {
                  this.passwordError.set('Passwords do not match.');
                  return;
            }
            if (!newPassword || newPassword.length < 8) {
                  this.passwordError.set('New password must be at least 8 characters.');
                  return;
            }

            this.isPasswordLoading.set(true);
            this.passwordSuccess.set(null);
            this.passwordError.set(null);

            this.authService
                    .changePassword(newPassword, currentPassword!)
                    .subscribe({
                          next: () => {
                                this.isPasswordLoading.set(false);
                                this.passwordSuccess.set('Password changed successfully.');
                                this.passwordForm.reset();
                          },
                          error: (err: HttpErrorResponse) => {
                                this.isPasswordLoading.set(false);
                                this.passwordError.set(this.extractError(err));
                          },
                    });
      }

      private parseGender(value: string | number | undefined): number {
            if (value === undefined || value === null) return 0.5;
            // Try numeric first (e.g. backend returns "0.3" or already a number)
            const n = parseFloat(String(value));
            if (!isNaN(n)) return n;
            // Reverse-map backend string labels → float midpoints
            const labelMap: Record<string, number> = {
                  'Male': 0.05,
                  'More masculine': 0.25,
                  'Mental illness': 0.3,   // backend label observed in feature scenario
                  'Non-binary': 0.5,
                  'More feminine': 0.75,
                  'Female': 0.95,
            };
            return labelMap[String(value)] ?? 0.5;
      }

      private extractError(err: HttpErrorResponse): string {
            const p = err.error as ProblemDetail;
            return p?.detail ?? p?.title ?? 'Something went wrong.';
      }

      get pf() {
            return this.profileForm.controls;
      }

      get sf() {
            return this.passwordForm.controls;
      }
}
