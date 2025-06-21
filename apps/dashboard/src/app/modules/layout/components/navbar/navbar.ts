import { Component, inject } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { User } from '../../../user/models/user.model';
import { UserService } from '../../../user/services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  imports: [
    CommonModule,
    RouterLink,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
})
export class Navbar {
  private menuService = inject(MenuService);
  protected menuItems = this.menuService.pagesMenu;

  // users menu
  private _authService = inject(AuthService);
  private _userService = inject(UserService);
  authUser: User | null = null;
  users: User[] = [];

  constructor() {
    // load demo users in top-right nav menu
    this._userService.users.subscribe((users) => (this.users = users));
    // get current user
    this._authService.authUser.subscribe((user) => (this.authUser = user));
  }

  /**
   * When changing the current user
   * @param user
   */
  changeUser(user: User) {
    this._authService.currentUser = user;
  }
}
