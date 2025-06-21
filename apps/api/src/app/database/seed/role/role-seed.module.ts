import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleSeedService } from './role-seed.service';
import { Role, User } from '@turbovets/auth';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User])],
  providers: [RoleSeedService],
  exports: [RoleSeedService],
})
export class RoleSeedModule {}
