import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  NonNullableFormBuilder,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { catchError, Subject, takeUntil, throwError } from 'rxjs';

import { googleSVG } from '../../svg/google.svg';
import { gitHubSVG } from '../../svg/github.svg';
import {
  AUTH_CONFIG,
  AUTH_SERVICE,
  AuthServiceInterface,
  LoginForm,
} from '../../interfaces/auth-service.interface';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css'],
})
export class LoginComponent {
  loginForm!: FormGroup<LoginForm>;
  loginError = '';
  private destroyed$ = new Subject<void>();

  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private sanitizer = inject(DomSanitizer);

  // Inject via tokens
  private authSrv = inject<AuthServiceInterface>(AUTH_SERVICE);
  private config = inject(AUTH_CONFIG);

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required]),
    });

    this.loginForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.loginError = '';
      });
  }

  login(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authSrv
        .login(username!, password!)
        .pipe(
          takeUntil(this.destroyed$),
          catchError((err) => {
            this.loginError = err?.error?.message || 'Errore di login';
            this.snackBar.open(this.loginError, 'Chiudi', { duration: 3000 });
            return throwError(() => err);
          })
        )
        .subscribe(() => {
          this.snackBar.open('Login effettuato con successo!', 'Chiudi', {
            duration: 3000,
          });
          this.router.navigate(['/']);
        });
    } else {
      this.snackBar.open('Compila tutti i campi obbligatori', 'Chiudi', {
        duration: 3000,
      });
    }
  }

  loginWithGoogle(): void {
    window.location.href = this.config.googleAuthLink;
  }

  loginWithGithub(): void {
    window.location.href = this.config.gitHubAuthLink;
  }

  googleSVG(pixel: number): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(googleSVG(pixel));
  }

  gitHubSVG(pixel: number): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(gitHubSVG(pixel));
  }

  get showGoogleAuth(): boolean {
    return this.config.enableGoogleAuth ?? false;
  }

  get showGitHubAuth(): boolean {
    return this.config.enableGitHubAuth ?? false;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
