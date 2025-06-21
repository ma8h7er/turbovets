import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../../environment/environment.development';

@Injectable({ providedIn: 'root' })
export class UserService {
  http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  users = new BehaviorSubject<User[]>([]);

  fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  setUsers(users: User[]) {
    this.users.next(users);
  }
}
