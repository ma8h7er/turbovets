import { Module } from '@nestjs/common';
import { AuthModule } from '@turbovets/auth';
import { UserController } from './user.controller';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
})
export class UserModule {}
