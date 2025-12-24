import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Register } from '../models/register-interface';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  readonly #http = inject(HttpClient);

  register(data: Register): Observable<unknown> {
    return this.#http.post<unknown>('/api/users/register', data);
  }
}
