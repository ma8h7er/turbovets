import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
    },
    {
      label: 'Tasks',
      route: '/tasks',
    },
  ];
}
