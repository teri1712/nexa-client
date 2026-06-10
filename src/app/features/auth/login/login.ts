import {Component, inject, OnInit, signal,} from '@angular/core';
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
export class LoginComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(IAuthService);
    private readonly tokenService = inject(ITokenStore);
    private readonly router = inject(Router);

    protected readonly isAdminLoading = signal(false);
    protected readonly errorMessage = signal<string | null>(null);

    protected readonly adminForm = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        password: ['', [Validators.required]],
    });

    ngOnInit(): void {
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
                next: () => this.router.navigate(['/docs/dashboard']),
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
