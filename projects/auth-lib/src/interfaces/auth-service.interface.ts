import { InjectionToken } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

export interface LoginForm {
  username: FormControl<string>;
  password: FormControl<string>;
}

export interface AuthConfig {
  googleAuthLink: string;
  gitHubAuthLink: string;
  enableGoogleAuth?: boolean;
  enableGitHubAuth?: boolean;
}

export interface AuthServiceInterface {
  login(email: string, password: string): Observable<any>;
}

export const AUTH_CONFIG = new InjectionToken<AuthConfig>('AUTH_CONFIG');
export const AUTH_SERVICE = new InjectionToken<AuthServiceInterface>(
  'AUTH_SERVICE'
);
