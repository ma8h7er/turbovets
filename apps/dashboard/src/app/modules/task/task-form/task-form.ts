import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Task } from '../models/task.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TaskService } from '../services/task.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
})
export class TaskForm implements OnInit, OnDestroy {
  taskId: number;
  task: Task;
  private _unsubscribeAll = new Subject<any>();
  form: FormGroup<any>;
  loading = false;
  errors = '';

  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  private _fb = inject(FormBuilder);
  private _taskService = inject(TaskService);

  constructor() {
    this._activatedRoute.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((params: any) => {
        this.taskId = params?.id;
      });
  }

  ngOnInit(): void {
    if (this.taskId) {
      this.findTask();
    } else {
      this.initForm();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.complete();
  }

  /**
   * If editing a task, get the details from the API
   */
  findTask() {
    this._taskService
      .find(this.taskId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          this.task = response;
          this.initForm();
        },
        error: (error) => {
          this._router.navigateByUrl('/tasks').catch((e) => console.log(e));
        },
      });
  }

  /**
   * Initialize the reactive form
   */
  initForm(): void {
    this.form = this._fb.group({
      title: [
        this.task?.title || '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(255),
        ],
      ],
      description: [this.task?.description || ''],
    });
  }

  /**
   * On submit the form
   */
  submit() {
    // Do nothing if the form is invalid
    if (this.form.invalid) return;

    this.form.disable();

    this.loading = true;
    this.errors = '';

    this._taskService
      .createOrUpdate(this.form.value)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this.loading = false;
          this._router
            .navigateByUrl('/tasks')
            .catch((error) => console.error(error));
        },
        error: () => {
          this.errors = 'Failed to save the task';
          this.loading = false;
        },
      });
  }
}
