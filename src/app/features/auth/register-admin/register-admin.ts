import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { IAuthService } from '../../../core/models/auth-service.interface';
import { ProblemDetail } from '../../../core/models/auth.models';

function noWhitespace(control: AbstractControl): ValidationErrors | null {
  return /\s/.test(control.value ?? '') ? { whitespace: true } : null;
}

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const pw = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pw && confirm && pw !== confirm ? { mismatch: true } : null;
}

@Component({
  selector: 'app-register-admin',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    MatIconModule,
  ],
  templateUrl: './register-admin.html',
  styleUrl: './register-admin.scss',
})
export class RegisterAdminComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(IAuthService);
  private readonly router = inject(Router);

  protected readonly isLoading = signal(false);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.fb.group(
    {
      username: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(20), noWhitespace],
      ],
      name: ['', [Validators.required, Validators.pattern(/\S.*/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      gender: [0.5, [Validators.required, Validators.min(0), Validators.max(1)]],
      dob: [null as string | null],
    },
    { validators: passwordsMatch },
  );

  protected readonly genderLabel = () => {
    const v = this.form.get('gender')?.value ?? 0.5;
    if (v <= 0.1) return 'Male';
    if (v <= 0.4) return 'More masculine';
    if (v <= 0.6) return 'Non-binary';
    if (v <= 0.9) return 'More feminine';
    return 'Female';
  };

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const { username, name, password, gender, dob } = this.form.value;

    this.authService
      .registerAdmin({
        username: username!,
        name: name!,
        password: password!,
        gender: gender!,
        dob: dob ?? undefined,
      })
      .subscribe({
        next: profile => {
          this.isLoading.set(false);
          this.successMessage.set(`"${profile.username}" created successfully`);
          this.form.reset({ gender: 0.5 });
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);
          const p = err.error as ProblemDetail;
          this.errorMessage.set(
            p?.detail ?? p?.title ?? 'Failed to create admin. Please try again.',
          );
        },
      });
  }

  get f() {
    return this.form.controls;
  }
}

