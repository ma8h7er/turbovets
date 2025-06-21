import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskList } from './task-list/task-list';
import { TaskForm } from './task-form/task-form';

const routes: Routes = [
  {
    path: '',
    component: TaskList,
  },
  {
    path: 'create',
    component: TaskForm,
  },
  {
    path: ':id',
    component: TaskForm,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskModule {}
