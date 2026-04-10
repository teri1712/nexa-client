import {Observable} from 'rxjs';
import {AccountResponse, AdminLoginRequest, ProfileResponse, SignUpRequest} from './auth.models';

/**
 * Public interface for authentication operations.
 * Components inject this instead of the concrete AuthService,
 * hiding token-store internals behind a clean contract.
 */
export abstract class IAuthService {
  abstract loginWithOidc(idToken: string): Observable<AccountResponse>;
  abstract loginWithCredentials(credentials: AdminLoginRequest): Observable<AccountResponse>;
  abstract registerAdmin(data: SignUpRequest): Observable<ProfileResponse>;
  abstract logout(): void;
}

