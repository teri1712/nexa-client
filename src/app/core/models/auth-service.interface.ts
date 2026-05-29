import {Observable} from 'rxjs';
import {AdminLoginRequest, ProfileResponse, SignUpRequest} from './auth.models';

/**
 * Public interface for authentication operations.
 * Components inject this instead of the concrete AuthService,
 * hiding token-store internals behind a clean contract.
 */
export abstract class IAuthService {

      abstract loginWithOidc(idToken: string): Observable<ProfileResponse>;

      abstract loginWithCredentials(credentials: AdminLoginRequest): Observable<ProfileResponse>;

      abstract registerAdmin(data: SignUpRequest): Observable<ProfileResponse>;

      abstract changePassword(newPassword: string, currentPassword?: string): Observable<ProfileResponse>;

      abstract logout(): void;
}

