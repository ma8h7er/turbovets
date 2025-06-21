import { ApiProperty } from '@nestjs/swagger';
import { TaskStatuses } from '../enums/task-status.enum';
import { UserResponseDto } from '@turbovets/auth';

export class TaskResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status: TaskStatuses;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;
}
