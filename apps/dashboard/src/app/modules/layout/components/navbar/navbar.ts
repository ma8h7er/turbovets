import { Component, inject } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
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
}
