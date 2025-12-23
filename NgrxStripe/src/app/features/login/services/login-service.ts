import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoginResponseInterface } from '../models/login-response-interface';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  readonly #http = inject(HttpClient);

  login(email: string, password: string): Observable<LoginResponseInterface> {
    return this.#http.post<LoginResponseInterface>('/api/users/login', { email, password });
  }

  refreshToken(userId: string, refreshToken: string): Observable<LoginResponseInterface> {
    return this.#http.post<LoginResponseInterface>('/api/refresh-token', {
      userId,
      refreshToken,
    });
  }
}
