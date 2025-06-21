import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../../task/entities/task.entity';

@Injectable()
export class TaskSeedService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>
  ) {}

  async run() {
    // Task 1
    await this.taskRepository.save(
      this.taskRepository.create({
        title: 'Follow up with John Doe',
        description: 'Last meeting we agreed to call the client again',
        organization: { id: 1 },
        user: { id: 5 },
      })
    );

    // Task 2
    await this.taskRepository.save(
      this.taskRepository.create({
        title: 'Kick-off meeting with devs',
        description: 'For the new project',
        organization: { id: 1 },
        user: { id: 3 },
      })
    );

    // Task 3
    await this.taskRepository.save(
      this.taskRepository.create({
        title: 'Create the SoW for the new design',
        description: 'UI design for the new client',
        organization: { id: 1 },
        user: { id: 3 },
      })
    );

    // Task 4
    await this.taskRepository.save(
      this.taskRepository.create({
        title: 'Create the SoW for the new design',
        description: 'UI design for the new client',
        organization: { id: 2 },
        user: { id: 4 },
      })
    );

    // Task 4
    await this.taskRepository.save(
      this.taskRepository.create({
        title: 'Random task',
        description: 'Random task',
        organization: { id: 2 },
        user: { id: 6 },
      })
    );
  }
}
