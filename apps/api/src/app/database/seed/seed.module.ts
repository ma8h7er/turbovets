import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from '../postgres-config.service';
import databaseConfig from '../config/database.config';
import appConfig from '../../config/app.config';
import { RoleSeedModule } from './role/role-seed.module';
import { OrganizationSeedModule } from './organization/organization-seed.module';

@Module({
  imports: [
    OrganizationSeedModule,
    RoleSeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [PostgresConfigService],
      useClass: PostgresConfigService,
    }),
  ],
})
export class SeedModule {}
