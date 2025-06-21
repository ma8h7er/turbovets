import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { TaskService } from '../services/task.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { Task } from '../models/task.model';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Sort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
} from '@angular/forms';
import { Pagination } from '../../../core/models/pagination.model';
import { DeleteDialog } from '../../../core/ui/delete-dialog/delete-dialog';
import { User } from '../../user/models/user.model';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.html',
  imports: [
    RouterLink,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatSortModule,
  ],
})
export class TaskList implements OnInit, AfterViewInit, OnDestroy {
  taskService = inject(TaskService);
  tasks: Task[] = [];
  displayedColumns: string[] = [
    'id',
    'title',
    'user',
    'organization',
    'actions',
  ];
  sortFilter = { orderBy: 'id', order: 'ASC' };
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll = new Subject<any>();
  pagination: Pagination = { take: 20, skip: 0 };
  dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);
  authUser: User | null = null;
  private _authService = inject(AuthService);
  hasActionPermission = false;
  loading = signal(true);

  constructor() {
    // get current user
    this._authService.authUser.subscribe((user) => {
      this.authUser = user;
      this.hasActionPermission = this.authUser.roles
        ?.map((r) => r.name)
        .some((role) => ['Owner', 'Admin'].includes(role));
      // when the current user is changed in the top-right menu, we load the tasks for the new user
      this.search();
    });
  }

  ngOnInit(): void {
    this.search();
  }

  ngAfterViewInit(): void {
    // Subscribe to search input field value changes
    this.searchInputControl.valueChanges
      .pipe(takeUntil(this._unsubscribeAll), debounceTime(700))
      .subscribe(() => this.search());
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
  }

  /**
   * Generate an object for filters
   * @returns
   */
  private collectFilters() {
    return {
      search: this.searchInputControl.getRawValue(),
      take: this.pagination.take,
      ...this.sortFilter,
    };
  }

  /**
   * Load tasks based on the filters
   */
  search() {
    this.loading.set(true);
    // Load tasks
    this.taskService
      .fetchTasks(this.collectFilters())
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          this.tasks = response;
          this.loading.set(false);
        },
        error: (response: any) => {
          console.error(response);
          this._snackBar.open('Something went wrong in loading tasks!', 'OK');
          this.loading.set(false);
        },
      });
  }

  /**
   * Sort tasks by id, name
   * @param sort
   * @returns
   */
  sortData(sort: Sort) {
    if (!sort.active) {
      return;
    }

    this.sortFilter = {
      orderBy: sort.active,
      order: this.sortFilter.order === 'ASC' ? 'DESC' : 'ASC',
    };

    this.search();
  }

  /**
   * On delete task, show a confirmation modal and delete the task if confirmed
   * @param task
   */
  onDeleteTask(task: Task) {
    const dialogRef = this.dialog.open(DeleteDialog, {
      data: { modelType: 'task', task: task },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.taskService
          .delete(task.id)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe({
            next: () => {
              // show success message
              this._snackBar.open('Task was deleted!', 'OK');
            },
            error: () => {
              this._snackBar.open('Something went wrong!', 'OK');
            },
          });
      }
    });
  }
}
