import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskSeedService } from './task-seed.service';
import { Task } from '../../../task/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TaskSeedService],
  exports: [TaskSeedService],
})
export class TaskSeedModule {}
