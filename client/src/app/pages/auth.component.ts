import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  readonly mode = signal<'login' | 'register'>('login');
  readonly error = signal('');
  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  setMode(mode: 'login' | 'register'): void {
    this.mode.set(mode);
    this.error.set('');
  }

  submit(): void {
    this.error.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Check your email and use a password of at least 6 characters.');
      return;
    }

    const { name, email, password } = this.form.getRawValue();
    if (this.mode() === 'register' && name.trim().length < 2) {
      this.error.set('Add the name we should put on the crate.');
      return;
    }

    this.saving.set(true);
    const request =
      this.mode() === 'login'
        ? this.auth.login(email, password)
        : this.auth.register(name.trim(), email, password);

    request.subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
        void this.router.navigateByUrl(returnUrl);
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        this.error.set(err.error?.message ?? 'We could not sign you in.');
      },
    });
  }

}
