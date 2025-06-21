import { Injectable, OnDestroy, signal } from '@angular/core';
import { MenuItem } from '../../../core/models/menu.model';
import { Menu } from '../../../core/constants/menu';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService implements OnDestroy {
  private _pagesMenu = signal<MenuItem[]>([]);
  private _subscription = new Subscription();

  constructor(private router: Router) {
    /** Set dynamic menu */
    this._pagesMenu.set(Menu.pages);

    const sub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        /** Activate menu base on active route */
        this._pagesMenu().forEach((menuItem: MenuItem) => {
          menuItem.active = this.isActive(menuItem.route);
        });
      }
    });
    this._subscription.add(sub);
  }

  get pagesMenu() {
    return this._pagesMenu();
  }

  public isActive(instruction: any): boolean {
    return this.router.isActive(this.router.createUrlTree([instruction]), {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
