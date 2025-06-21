import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto, UserService } from '@turbovets/auth';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private service: UserService) {}

  /**
   * List all users
   *
   * @param req The request object
   * @returns Promise<UserResponseDto[]>
   */
  @ApiOkResponse({ type: [UserResponseDto] })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    return await this.service.findAll();
  }
}
