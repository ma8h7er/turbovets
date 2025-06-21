import { ApiProperty } from '@nestjs/swagger';
import { OrganizationResponseDto } from './organization-response.dto';
import { RoleResponseDto } from './role-response.dto';

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  organization: OrganizationResponseDto;

  @ApiProperty()
  roles?: RoleResponseDto[];
}
