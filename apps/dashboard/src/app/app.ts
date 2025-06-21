import {
  Component,
  HostBinding,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from './modules/user/models/user.model';
import { UserService } from './modules/user/services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from './core/auth/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Layout } from './modules/layout/layout';

@Component({
  imports: [Layout, RouterModule, MatProgressSpinnerModule],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App implements OnInit, OnDestroy {
  @HostBinding('class') currentTheme = 'theme-light'; // Default theme
  private userService = inject(UserService);
  private authService = inject(AuthService);

  loading = signal(true);
  private _unsubscribeAll = new Subject<any>();

  currentUser = signal<User | null>(null);

  ngOnInit(): void {
    // Start loading
    this.loading.set(true);

    // Load users for the demo
    this.userService
      .fetchUsers()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (users: any) => {
          this.userService.setUsers(users);

          if (users && users.length) {
            // set the first user as a current user
            this.authService.currentUser = users[0];
            this.currentUser.set(users[0]);
          }

          this.loading.set(false);
        },
        error: (response: any) => {
          console.error(response);
          this.loading.set(false);
        },
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
  }
}
