import {
  FieldConfig,
  AUTH_CONFIG,
} from '../../interfaces/auth-lib.config.interfaces';
import { Component, Input, ViewEncapsulation, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { Subject, catchError, takeUntil, throwError } from 'rxjs';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { gitHubSVG } from '../../svg/github.svg';
import { googleSVG } from '../../svg/google.svg';

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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  @Input() fields: FieldConfig[] = [];

  loginForm!: FormGroup;
  loginError = '';
  submitted = false;
  destroyed$ = new Subject<void>();

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private sanitizer = inject(DomSanitizer);
  private config = inject(AUTH_CONFIG);

  ngOnInit(): void {
    const formGroupConfig: any = {};
    this.fields.forEach((field) => {
      formGroupConfig[field.formControlName] = [
        '',
        field.validators ?? (field.required ? [Validators.required] : []),
      ];
    });
    this.loginForm = this.fb.group(formGroupConfig);

    this.loginForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.loginError = '';
      });
  }

  getFormControl(name: string) {
    return this.loginForm.get(name);
  }

  getErrorKeys(errorMessages?: { [key: string]: string }): string[] {
    return errorMessages ? Object.keys(errorMessages) : [];
  }

  login(): void {
    this.submitted = true;
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      if (!this.config.loginFn) {
        console.error('loginFn non è definita');
        return;
      }

      this.config
        .loginFn(username, password)
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
        panelClass: 'custom-snackbar',
        duration: 30000,
      });
    }
  }

  loginWithGoogle(): void {
    if (this.config.googleAuthLink)
      window.location.href = this.config.googleAuthLink;
    else
      console.error(
        'Link di OAuth per google non inserito nella configurazione'
      );
  }

  loginWithGithub(): void {
    if (this.config.gitHubAuthLink)
      window.location.href = this.config.gitHubAuthLink;
    else
      console.error(
        'Link di OAuth per google non inserito nella configurazione'
      );
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
