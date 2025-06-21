import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TaskService } from '../services/task.service';

/**
 * Guard to check if the task is accessible by the current user
 * User object is from the request and the task ID from the request params
 *
 * Example: /api/tasks/1
 */
@Injectable()
export class TaskAccessibleByUserGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly taskService: TaskService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Access route parameters (e.g., /tasks/:id)
    const taskId = request.params.id;
    if (!taskId) return true; // no need to check accessibility

    // Check user
    if (!request.user) return false;

    return await this.taskService.taskAccessibleByUser(+taskId, request.user);
  }
}
