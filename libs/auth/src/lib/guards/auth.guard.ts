import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Access the request, response, and handler using ExecutionContext
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    if (headers && headers['x-user-id']) {
      const user = await this.userService.findById(headers['x-user-id']);

      if (!user) return false;

      request.user = user;

      return true;
    }

    return false;
  }
}
