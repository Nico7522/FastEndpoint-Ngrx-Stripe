import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { LoginActions } from './actions/login.type';
import { selectError, selectIsLoading } from './selectors/login.selectors';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, AsyncPipe, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  readonly #store = inject(Store);
  readonly #formBuilder = inject(FormBuilder);
  readonly isLoading$ = this.#store.select(selectIsLoading);
  readonly error$ = this.#store.select(selectError);

  readonly form = this.#formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    const data = this.form.getRawValue();
    this.#store.dispatch(
      LoginActions.login({ email: data.email ?? '', password: data.password ?? '' })
    );
  }
}
