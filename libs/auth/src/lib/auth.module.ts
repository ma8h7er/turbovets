import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Organization } from './entities/organization.entity';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, Role, User])],
  providers: [UserService],
  exports: [UserService],
})
export class AuthModule {}
