import { Injectable } from '@angular/core';
import { DecodedTokenInterface } from '../../features/login/models/decoded-token-interface';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  /**
   * Decodes the token and returns the user information
   * @param token - The token to decode
   * @returns The user information
   */
  decodeToken(token: string): DecodedTokenInterface | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);

      return {
        userInfo: {
          id: +payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid'],
          email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
          username: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
          role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        },
        exp: payload.exp,
        iat: payload.iat,
      };
    } catch {
      return null;
    }
  }
}
