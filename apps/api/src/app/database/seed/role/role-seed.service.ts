import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, User } from '@turbovets/auth';
import { RoleEnum } from '@turbovets/auth';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async run() {
    //Owner role
    const countOwner = await this.roleRepository.count({
      where: {
        id: RoleEnum.Owner,
      },
    });

    if (!countOwner) {
      const owner = await this.roleRepository.save(
        this.roleRepository.create({
          id: RoleEnum.Owner,
          name: 'Owner',
        })
      );

      // Create owner user in first org
      await this.userRepository.save(
        this.userRepository.create({
          id: 1,
          firstName: 'Chris',
          lastName: 'Owner',
          organization: { id: 1 },
          roles: [{ id: owner.id }],
        })
      );

      // Create owner user in second org
      await this.userRepository.save(
        this.userRepository.create({
          id: 2,
          firstName: 'Maher',
          lastName: 'Owner',
          organization: { id: 2 },
          roles: [{ id: owner.id }],
        })
      );
    }

    // Admin role
    const countAdmin = await this.roleRepository.count({
      where: {
        id: RoleEnum.Admin,
      },
    });

    if (!countAdmin) {
      const admin = await this.roleRepository.save(
        this.roleRepository.create({
          id: RoleEnum.Admin,
          name: 'Admin',
        })
      );

      // Create admin user in first org
      await this.userRepository.save(
        this.userRepository.create({
          id: 3,
          firstName: 'Joe',
          lastName: 'Admin',
          organization: { id: 1 },
          roles: [{ id: admin.id }],
        })
      );

      // Create admin user in second org
      await this.userRepository.save(
        this.userRepository.create({
          id: 4,
          firstName: 'Greg',
          lastName: 'Admin',
          organization: { id: 2 },
          roles: [{ id: admin.id }],
        })
      );
    }

    // Viewer role
    const countViewer = await this.roleRepository.count({
      where: {
        id: RoleEnum.Viewer,
      },
    });

    if (!countViewer) {
      const viewer = await this.roleRepository.save(
        this.roleRepository.create({
          id: RoleEnum.Viewer,
          name: 'Viewer',
        })
      );

      // Create viewer user in first org
      await this.userRepository.save(
        this.userRepository.create({
          id: 5,
          firstName: 'Mark',
          lastName: 'Viewer',
          organization: { id: 1 },
          roles: [{ id: viewer.id }],
        })
      );

      // Create viewer user in second org
      await this.userRepository.save(
        this.userRepository.create({
          id: 6,
          firstName: 'Ayelen',
          lastName: 'Viewer',
          organization: { id: 2 },
          roles: [{ id: viewer.id }],
        })
      );
    }
  }
}
