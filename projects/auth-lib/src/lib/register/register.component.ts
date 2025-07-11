//  Angular Core & Common
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Forms
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

// Angular Router
import { Router, RouterModule } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

// RxJS
import { Subject, catchError, pipe, takeUntil, throwError } from 'rxjs';

// Angular Platform Browser
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { gitHubSVG } from '../../svg/github.svg';
import { googleSVG } from '../../svg/google.svg';
import { AUTH_CONFIG } from '../../interfaces/auth-lib.config.interfaces';

@Component({
  selector: 'lib-register',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private destroyed$ = new Subject<void>();
  private sanitizer = inject(DomSanitizer);
  private config = inject(AUTH_CONFIG);

  registerForm: FormGroup = new FormGroup({});
  hidePassword = true;
  hideConfirmPassword = true;
  registerError: string = '';

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        username: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        checkpassword: ['', Validators.required],
      },
      {
        validators: [this.matchPasswordsValidator()],
      }
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  extractFilenameFromUrl(url: string): string {
    try {
      return url.split('/').pop()?.split('?')[0] ?? 'Immagine da URL';
    } catch {
      return 'Immagine da URL';
    }
  }

  // Password visibility toggle
  togglePasswordVisibility(isConfirmPassword: boolean = false) {
    if (!isConfirmPassword) this.hidePassword = !this.hidePassword;
    else this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  matchPasswordsValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const checkpassword = group.get('checkpassword')?.value;
      return password === checkpassword ? null : { passwordMismatch: true };
    };
  }

  // Registration method
  register(): void {
    if (!this.registerForm.valid) {
      this.snackBar.open('Controlla tutti i campi obbligatori', 'Chiudi', {
        duration: 3000,
      });
      return;
    }

    const formData = new FormData();
    const formValues = this.registerForm.value;

    for (const key in formValues) {
      if (key !== 'picture') {
        formData.append(key, formValues[key]);
      }
    }

    if (!this.config.registerFn) {
      console.error('loginFn non è definita');
      return;
    }

    this.config
      .registerFn(formValues)
      .pipe(
        takeUntil(this.destroyed$),
        catchError((err) => {
          this.registerError = err?.error?.message || 'Errore di registrazione';
          this.snackBar.open(this.registerError, 'Chiudi', {
            duration: 3000,
          });
          return throwError(() => err);
        })
      )
      .subscribe(() => {
        this.snackBar.open('Registrazione completata!', 'Chiudi', {
          duration: 3000,
        });
        this.router.navigate(['/login']);
      });
  }

  //OAuth methods
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

  // Restituisce l'SVG di Google come HTML "sicuro"
  googleSVG(pixel: number): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(googleSVG(pixel));
  }

  gitHubSVG(pixel: number): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(gitHubSVG(pixel));
  }
}
