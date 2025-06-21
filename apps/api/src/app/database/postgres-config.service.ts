import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Environment } from '../enums/environment.enum';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class PostgresConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.getOrThrow('database.type', { infer: true }),
      host: this.configService.getOrThrow('database.host', { infer: true }),
      port: this.configService.getOrThrow('database.port', { infer: true }),
      username: this.configService.getOrThrow('database.username', {
        infer: true,
      }),
      password: this.configService.getOrThrow('database.password', {
        infer: true,
      }),
      database: this.configService.getOrThrow('database.name', { infer: true }),
      entities: [],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      migrationsRun: false,
      synchronize: this.configService.getOrThrow('database.synchronize', {
        infer: true,
      }),
      dropSchema: false,
      logging:
        this.configService.getOrThrow('app.nodeEnv', { infer: true }) !==
        Environment.Production,
      cli: {
        entitiesDir: 'src',

        subscribersDir: 'subscriber',
      },
      extra: {
        // based on https://node-postgres.com/apis/pool
        // max connection pool size
        max: this.configService.get('database.maxConnections', { infer: true }),
        ssl: this.configService.get('database.sslEnabled', { infer: true })
          ? {
              rejectUnauthorized: this.configService.get(
                'database.rejectUnauthorized',
                { infer: true }
              ),
              ca:
                this.configService.get('database.ca', { infer: true }) ??
                undefined,
              key:
                this.configService.get('database.key', { infer: true }) ??
                undefined,
              cert:
                this.configService.get('database.cert', { infer: true }) ??
                undefined,
            }
          : undefined,
      },
    } as TypeOrmModuleOptions;
  }
}
