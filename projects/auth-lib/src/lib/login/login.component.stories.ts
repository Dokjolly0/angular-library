import { AUTH_CONFIG } from '../../interfaces/auth-lib.config.interfaces';
import { AUTH_SERVICE } from '../../interfaces/auth-lib.service.interfaces';
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
import { of } from 'rxjs';

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
          provide: AUTH_SERVICE,
          useValue: {
            login: () => ({
              pipe: () => ({ subscribe: () => {} }),
            }),
          },
        },
        {
          provide: AUTH_CONFIG,
          useValue: {
            enableGoogleAuth: false,
            enableGitHubAuth: false,
            googleAuthLink: 'https://google.com',
            gitHubAuthLink: 'https://github.com',
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
