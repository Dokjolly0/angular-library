import {
  AUTH_CONFIG,
  AUTH_SERVICE,
  LoginFieldConfig,
} from '../../interfaces/auth-service.interfaces';
import { BrowserModule, By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common'; // ⬅️ IMPORTANTE!
import { LoginComponent } from './login.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('LoginComponent Template', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const mockFields: LoginFieldConfig[] = [
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
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        BrowserModule,
        CommonModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatSnackBarModule,
      ],
      providers: [
        provideRouter([]),
        { provide: AUTH_SERVICE, useValue: { login: () => of(true) } },
        {
          provide: AUTH_CONFIG,
          useValue: {
            googleAuthLink: 'https://google.com',
            gitHubAuthLink: 'https://github.com',
            enableGoogleAuth: true,
            enableGitHubAuth: false,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    component.fields = mockFields;
    fixture.detectChanges();
  });

  it('should render all input fields passed via @Input', () => {
    const inputs = fixture.debugElement.queryAll(By.css('input'));
    expect(inputs.length).toBe(2);
    expect(inputs[0].attributes['type']).toBe('email');
    expect(inputs[1].attributes['type']).toBe('password');
  });

  it('should show mat-error on required validation', () => {
    component.login();
    fixture.detectChanges();

    const errors = fixture.debugElement.queryAll(By.css('mat-error'));
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].nativeElement.textContent).toContain('Email obbligatoria');
  });

  it('should render Google button but not GitHub', () => {
    const googleBtn = fixture.debugElement.query(
      By.css('button[mat-stroked-button][color="warn"]')
    );
    const gitHubBtn = fixture.debugElement.query(
      By.css('button[mat-stroked-button][color="accent"]')
    );

    expect(googleBtn).toBeTruthy();
    expect(gitHubBtn).toBeFalsy();
  });

  it('should submit form and call login()', () => {
    const spy = spyOn(component as any, 'login').and.callThrough();

    component.loginForm.setValue({
      username: 'user@test.com',
      password: '1234',
    });
    fixture.detectChanges();

    const buttonDebug = fixture.debugElement.query(
      By.css('button[type="submit"]')
    );

    expect(buttonDebug).toBeTruthy(); // extra sanity check
    buttonDebug.nativeElement.click();

    expect(spy).toHaveBeenCalled();
  });
});
