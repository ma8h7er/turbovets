import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '@turbovets/auth';
import { OrganizationSeedService } from './organization-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  providers: [OrganizationSeedService],
  exports: [OrganizationSeedService],
})
export class OrganizationSeedModule {}
