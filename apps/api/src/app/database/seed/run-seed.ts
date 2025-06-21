import { NestFactory } from '@nestjs/core';
import { RoleSeedService } from './role/role-seed.service';
import { SeedModule } from './seed.module';
import { OrganizationSeedService } from './organization/organization-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(OrganizationSeedService).run();
  await app.get(RoleSeedService).run();

  await app.close();
};

void runSeed();
