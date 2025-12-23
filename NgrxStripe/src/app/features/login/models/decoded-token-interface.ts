import { User } from './user-interface';

export interface DecodedTokenInterface {
  userInfo: User;
  exp: number;
  iat: number;
}
