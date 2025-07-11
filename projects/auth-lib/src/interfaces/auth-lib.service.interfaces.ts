import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface AuthServiceInterface {
  login(email: string, password: string): Observable<any>;
  login(username: string, password: string): Observable<any>;
}

export const AUTH_SERVICE = new InjectionToken<AuthServiceInterface>(
  'AUTH_SERVICE'
);
