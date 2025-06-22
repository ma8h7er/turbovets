import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { TaskStatuses } from '../enums/task-status.enum';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({ example: 2, type: Number })
  @IsOptional()
  status?: TaskStatuses;
}
