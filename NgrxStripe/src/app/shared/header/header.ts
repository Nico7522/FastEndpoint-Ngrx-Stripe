import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { selectCartQuantity } from '../../features/cart/selectors/cart.selectors';
import { selectIsLoggedIn } from '../../features/login/selectors/login.selectors';
import { LoginActions } from '../../features/login/actions/login.type';

@Component({
  selector: 'app-header',
  imports: [RouterModule, AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  readonly #store = inject(Store);
  cartQuantity$ = this.#store.select(selectCartQuantity);
  isLoggedIn$ = this.#store.select(selectIsLoggedIn);
  onLogout(): void {
    this.#store.dispatch(LoginActions.logout());
  }
}
