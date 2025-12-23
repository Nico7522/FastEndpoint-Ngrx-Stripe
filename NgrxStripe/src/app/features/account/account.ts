import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectExp, selectUser } from '../login/selectors/login.selectors';
import { AsyncPipe } from '@angular/common';
import { LoginActions } from '../login/actions/login.type';
import { RouterModule } from '@angular/router';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-account',
  imports: [AsyncPipe, RouterModule],
  templateUrl: './account.html',
  styleUrl: './account.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Account {
  readonly #store = inject(Store);
  readonly accountInfo$ = this.#store.select(selectUser);
  readonly exp$ = this.#store.select(selectExp).pipe(map((exp) => exp));

  logout(): void {
    this.#store.dispatch(LoginActions.logout());
  }
}
