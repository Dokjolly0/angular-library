import { ValidatorFn } from '@angular/forms';
import { InjectionToken } from '@angular/core';

export interface LoginFieldConfig {
  label: string;
  type: string;
  formControlName: string;
  required?: boolean;
  validators?: ValidatorFn[];
  errorMessages?: { [errorKey: string]: string };
}

export interface AuthConfig {
  googleAuthLink: string;
  gitHubAuthLink: string;
  enableGoogleAuth?: boolean;
  enableGitHubAuth?: boolean;
}

export const AUTH_CONFIG = new InjectionToken<AuthConfig>('AUTH_CONFIG');
