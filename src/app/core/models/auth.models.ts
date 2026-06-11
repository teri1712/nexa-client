// ── Tokens ────────────────────────────────────────────────────────────────────
export interface AccessToken {
    accessToken: string;
    refreshToken: string;
}

// ── Responses ─────────────────────────────────────────────────────────────────
export interface ProfileResponse {
    id: string;
    username: string;
    name: string;
    dob: string | null;
    role: 'ADMIN' | 'USER' | string;
    gender: string;
}

export interface AccountResponse {
    profile: ProfileResponse;
    accessToken: AccessToken;
}


// ── Requests ──────────────────────────────────────────────────────────────────
export interface AdminLoginRequest {
    username: string;
    password: string;
}

export interface SignUpRequest {
    username: string;
    password: string;
    name: string;
    gender: number;
    dob: string;
    avatar?: string;
}

export interface ProfileRequest {
    name?: string;
    gender?: number;
    dob?: string;
}

// ── Errors ────────────────────────────────────────────────────────────────────
export interface ProblemDetail {
    type?: string;
    title?: string;
    status?: number;
    detail?: string;
    instance?: string;
}

