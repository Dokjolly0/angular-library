import { ValidatorFn } from '@angular/forms';
import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface FieldConfig {
  label: string;
  type: string;
  formControlName: string;
  required?: boolean;
  validators?: ValidatorFn[];
  errorMessages?: { [errorKey: string]: string };
}

export interface AuthConfig {
  googleAuthLink?: string;
  gitHubAuthLink?: string;
  enableGoogleAuth?: boolean;
  enableGitHubAuth?: boolean;
  loginFn?: (username: string, password: string) => Observable<any>;
  registerFn?: (data: any) => Observable<any>;
}
export const AUTH_CONFIG = new InjectionToken<AuthConfig>('AUTH_CONFIG');

export interface RegisterConfig {
  registerFn: (data: FormData | any) => Observable<any>;
  googleAuthLink?: string;
  gitHubAuthLink?: string;
  enableGoogleAuth?: boolean;
  enableGitHubAuth?: boolean;
}
export const REGISTER_CONFIG = new InjectionToken<RegisterConfig>(
  'REGISTER_CONFIG'
);
