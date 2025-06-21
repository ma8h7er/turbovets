import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { TaskStatuses } from '../enums/task-status.enum';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({ example: 2, type: Number })
  @IsNumber()
  status: TaskStatuses;
}
