import { Module } from '@nestjs/common';
import { TaskService } from './services/task.service';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { AuthModule } from '@turbovets/auth';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), AuthModule],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
