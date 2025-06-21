import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TaskService } from './services/task.service';
import { AuthGuard, RoleEnum, RolesGuard, Roles } from '@turbovets/auth';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskAccessibleByUserGuard } from './guards/task-accessible.guard';
import { TaskResponseDto } from './dto/task-response.dto';

@ApiTags('Task')
@Controller('tasks')
@UseGuards(AuthGuard, RolesGuard)
export class TaskController {
  constructor(private service: TaskService) {}

  /**
   * List tasks based on user role and organization
   *
   * @param req The request object
   * @returns Promise<TaskResponseDto[]>
   */
  @ApiOkResponse({ type: [TaskResponseDto] })
  @ApiHeader({ name: 'x-user-id', description: 'User ID' })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Req() req,
    @Query() findTasksDto: any
  ): Promise<TaskResponseDto[]> {
    return await this.service.findAll(req.user, findTasksDto);
  }

  /**
   * Find a task by ID
   *
   * @param id The task ID
   * @returns Promise<TaskResponseDto>
   */
  @ApiOkResponse({ type: TaskResponseDto })
  @ApiHeader({ name: 'x-user-id', description: 'User ID' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found.' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden. When the user does not have access to the task',
  })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @UseGuards(TaskAccessibleByUserGuard)
  findOne(@Param('id') id: string): Promise<TaskResponseDto> {
    return this.service.findById(+id);
  }

  /**
   * Create a new task
   *
   * @param req The request object
   * @param createTaskDto the request data
   * @returns Promise<TaskResponseDto>
   */
  @ApiCreatedResponse({ type: TaskResponseDto })
  @ApiHeader({ name: 'x-user-id', description: 'User ID' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found.' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'Forbidden. When the user does not have permission to create a task',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @Roles(RoleEnum.Owner, RoleEnum.Admin)
  async create(
    @Req() req,
    @Body() createTaskDto: CreateTaskDto
  ): Promise<TaskResponseDto> {
    return await this.service.create(req.user, createTaskDto);
  }

  /**
   * Update an existing task
   *
   * @param id The task ID
   * @param updateTaskDto The request data
   * @returns Promise<TaskResponseDto>
   */
  @ApiOkResponse({ type: TaskResponseDto })
  @ApiHeader({ name: 'x-user-id', description: 'User ID' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found.' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'Forbidden. When the user does not have permission to update the task',
  })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @UseGuards(TaskAccessibleByUserGuard)
  @Roles(RoleEnum.Owner, RoleEnum.Admin)
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto
  ): Promise<TaskResponseDto> {
    return this.service.update(+id, updateTaskDto);
  }

  /**
   * Delete a task
   *
   * @param id The task ID
   * @returns Promise<void>
   */
  @ApiNoContentResponse()
  @ApiHeader({ name: 'x-user-id', description: 'User ID' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found.' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'Forbidden. When the user does not have permission to delete the task',
  })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @UseGuards(TaskAccessibleByUserGuard)
  @Roles(RoleEnum.Owner)
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(+id);
  }
}
