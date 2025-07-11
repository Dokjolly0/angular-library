import { AUTH_CONFIG } from '../../interfaces/auth-lib.config.interfaces';
import { Meta, StoryObj } from '@storybook/angular';

import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata } from '@storybook/angular';
import { of, throwError } from 'rxjs';

const meta: Meta<LoginComponent> = {
  title: 'Auth/LoginComponent',
  component: LoginComponent,
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: AUTH_CONFIG,
          useValue: {
            enableGoogleAuth: false,
            enableGitHubAuth: false,
            googleAuthLink: 'https://google.com',
            gitHubAuthLink: 'https://github.com',
            loginFn: (username: string, password: string) => {
              if (username === 'a' && password === 'a') {
                console.log('Login riuscito');
                return of({ success: true });
              } else {
                console.log('Login fallito');
                return throwError(() => ({
                  error: { message: 'Credenziali non valide' },
                }));
              }
            },
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {},
            },
            queryParams: of({}),
            params: of({}),
          },
        },
      ],
    }),
  ],
};

export default meta;

type Story = StoryObj<LoginComponent>;

export const Default: Story = {
  args: {
    fields: [
      {
        label: 'Email',
        type: 'email',
        formControlName: 'username',
        required: true,
        errorMessages: { required: 'Email obbligatoria' },
      },
      {
        label: 'Password',
        type: 'password',
        formControlName: 'password',
        required: true,
        errorMessages: { required: 'Password obbligatoria' },
      },
    ],
  },
};

/** Real example
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from 'your-lib-path'; // importa dal tuo pacchetto
import { AUTH_CONFIG } from 'your-lib-path';
import { AuthService } from './auth.service';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule, LoginComponent],
  declarations: [],
  providers: [
    {
      provide: AUTH_CONFIG,
      useFactory: (authService: AuthService) => ({
        googleAuthLink: 'https://google.com/auth',
        gitHubAuthLink: 'https://github.com/auth',
        enableGoogleAuth: true,
        enableGitHubAuth: true,
        loginFn: (username: string, password: string) =>
          authService.login(username, password),
      }),
      deps: [AuthService],
    },
  ],
})
export class AuthModule {}
*/
