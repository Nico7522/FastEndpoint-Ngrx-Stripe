import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RegisterService } from './services/register';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  readonly #formBuilder = inject(FormBuilder);
  readonly #registerService = inject(RegisterService);
  readonly #router = inject(Router);

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.#formBuilder.group(
    {
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required]],
    },
    {
      validators: this.#passwordMatchValidator,
    }
  );

  #passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const passwordConfirm = control.get('passwordConfirm');

    if (password?.value !== passwordConfirm?.value) {
      passwordConfirm?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    const formValue = this.form.getRawValue();
    const registerData = {
      username: formValue.username ?? '',
      email: formValue.email ?? '',
      password: formValue.password ?? '',
      passwordConfirm: formValue.passwordConfirm ?? '',
    };

    console.log(registerData);
    this.#registerService.register(registerData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.#router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set(err.error?.message || "Une erreur est survenue lors de l'inscription");
      },
    });
  }

  get username() {
    return this.form.get('username');
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get passwordConfirm() {
    return this.form.get('confirmPassword');
  }
}
