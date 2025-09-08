import {Role} from './role';

export class User {
  id: number;
  username: string;
  password: string;
  email: string;
  phone: string;
  role: Role;
}
