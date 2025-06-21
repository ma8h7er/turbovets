import { inject, Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment.development';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private _http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  fetchTasks(filters: any): Observable<Task[]> {
    return this._http.get<Task[]>(`${this.apiUrl}/tasks`, {
      params: filters,
    });
  }

  find(id: number): Observable<Task> {
    return this._http.get<Task>(`${this.apiUrl}/tasks/${id}`);
  }

  createOrUpdate(data: any, id?: number): Observable<Task> {
    if (id) {
      // update an exisiting task
      return this._http.patch<Task>(`${this.apiUrl}/tasks/${id}`, data);
    }

    // create a new task
    return this._http.post<Task>(`${this.apiUrl}/tasks`, data);
  }

  delete(id: number): Observable<any> {
    return this._http.delete<Task>(`${this.apiUrl}/tasks/${id}`);
  }
}
