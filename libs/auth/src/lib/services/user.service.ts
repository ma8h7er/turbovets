import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum } from '../enums/role.enum';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  hasRoles(user: User, roles: RoleEnum[]): boolean {
    return roles.some((role) =>
      user.roles.map((role) => role.id).includes(role)
    );
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find();

    return users.map((user: User) => this.buildUserResponse(user));
  }

  /**
   * Map the User model to UserResponseDto
   *
   * @param task
   * @returns
   */
  private buildUserResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      organization: { id: user.organization.id, name: user.organization.name },
      roles: user.roles.map((r) => ({ id: r.id, name: r.name })),
    };
  }
}
