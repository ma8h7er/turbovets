import { Injectable } from '@angular/core';
import { User } from '../../modules/user/models/user.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  authUser = new BehaviorSubject<User | null>(null);

  // Fake authentication
  set currentUser(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.authUser.next(user);
  }

  get currentUser(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  signOut() {
    localStorage.removeItem('currentUser');
  }
}
