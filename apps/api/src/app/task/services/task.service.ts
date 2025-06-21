import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindTasksDto } from '../dto/find-tasks.dto';
import { User, UserService } from '@turbovets/auth';
import { RoleEnum } from '@turbovets/auth';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskResponseDto } from '../dto/task-response.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService
  ) {}

  /**
   * Map the Task model to TaskResponseDto
   *
   * @param task
   * @returns
   */
  private buildTaskResponse(task: Task): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      createdAt: task.createdAt,
      user: {
        id: task.user.id,
        firstName: task.user.firstName,
        lastName: task.user.lastName,
        organization: {
          id: task.user.organization?.id,
          name: task.user.organization?.name,
        },
      },
    };
  }

  /**
   * Get accessible tasks based on user roles and organization
   *
   * @param findTasksDto
   * @returns Promise<TaskResponseDto[]>
   */
  async findAll(
    user: User,
    findTasksDto?: FindTasksDto
  ): Promise<TaskResponseDto[]> {
    const where = {
      organization: user.organization,
    };

    if (findTasksDto.search && findTasksDto.search != 'null') {
      where['title'] = ILike(`%${findTasksDto.search || ''}%`);
    }

    // Order by ID - ASC by default
    let order = { id: 'ASC' };

    if (findTasksDto.orderBy) {
      order = {};
      order[findTasksDto.orderBy] = findTasksDto.order || 'ASC';
    }

    // Pagination
    const take = findTasksDto.take || 10;
    const skip = findTasksDto.skip || 0;

    const tasks = await this.taskRepository.find({
      where,
      order,
      take,
      skip,
    });

    return tasks.map((task: Task) => this.buildTaskResponse(task));
  }

  /**
   * Find a task by ID
   *
   * @param id The task ID
   * @returns Promise<Task>
   */
  async findOne(id: number): Promise<Task> {
    return await this.taskRepository.findOne({ where: { id } });
  }

  /**
   * Find a task by ID
   *
   * @param id The task ID
   * @returns Promise<Task>
   */
  async findById(id: number): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException();
    }

    return this.buildTaskResponse(task);
  }

  /**
   * Check if the task is accessible by the provided user
   *
   * @param id The task ID
   * @param user The user object
   * @returns Promise<boolean>
   */
  async taskAccessibleByUser(id: number, user: User): Promise<boolean> {
    const task = await this.findOne(id);

    if (!task || task.organization.id !== user.organization.id) {
      throw new NotFoundException();
    }

    return (
      task.user.id === user.id ||
      this.userService.hasRoles(user, [RoleEnum.Owner, RoleEnum.Admin])
    );
  }

  /**
   * Create a new task for the provided user
   *
   * @param user The user object
   * @param createTaskDto The request data
   * @returns Promise<TaskResponseDto>
   */
  async create(
    user: User,
    createTaskDto: CreateTaskDto
  ): Promise<TaskResponseDto> {
    const newTask = this.taskRepository.create({
      ...createTaskDto,
      user,
      organization: user.organization,
    });

    const task = await this.taskRepository.save(newTask);

    return this.buildTaskResponse(task);
  }

  /**
   * Update a task
   *
   * @param id The task ID
   * @param updateTaskDto The request data
   * @returns Promise<TaskResponseDto>
   */
  async update(
    id: number,
    updateTaskDto: UpdateTaskDto
  ): Promise<TaskResponseDto> {
    const updatedTask = await this.findOne(id);

    if (!updatedTask) {
      throw new NotFoundException();
    }

    Object.assign(updatedTask, updateTaskDto);

    const task = await this.taskRepository.save(updatedTask);

    return this.buildTaskResponse(task);
  }

  /**
   * Delete a task
   *
   * @param id The task ID
   * @returns Promise<void>
   */
  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    if (!task) {
      throw new NotFoundException();
    }

    await this.taskRepository.remove(task);
  }
}
