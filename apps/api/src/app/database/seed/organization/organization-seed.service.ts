import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '@turbovets/auth';

@Injectable()
export class OrganizationSeedService {
  constructor(
    @InjectRepository(Organization)
    private repository: Repository<Organization>
  ) {}

  async run() {
    // Turbovets
    const countTurbovets = await this.repository.count({
      where: {
        name: 'Turbovets',
      },
    });

    if (!countTurbovets) {
      await this.repository.save(
        this.repository.create({
          name: 'Turbovets',
        })
      );
    }

    // Google
    const countGoogle = await this.repository.count({
      where: {
        name: 'Google',
      },
    });

    if (!countTurbovets) {
      await this.repository.save(
        this.repository.create({
          name: 'Google',
        })
      );
    }
  }
}
