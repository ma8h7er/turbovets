import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Environment } from '../enums/environment.enum';
import { AllConfigType } from '../config/config.type';
import { Organization, Role, User } from '@turbovets/auth';

@Injectable()
export class PostgresConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.getOrThrow<AllConfigType>('database.type', {
        infer: true,
      }),
      host: this.configService.getOrThrow<AllConfigType>('database.host', {
        infer: true,
      }),
      port: this.configService.getOrThrow<AllConfigType>('database.port', {
        infer: true,
      }),
      username: this.configService.getOrThrow<AllConfigType>(
        'database.username',
        {
          infer: true,
        }
      ),
      password: this.configService.getOrThrow<AllConfigType>(
        'database.password',
        {
          infer: true,
        }
      ),
      database: this.configService.getOrThrow<AllConfigType>('database.name', {
        infer: true,
      }),
      entities: [Organization, Role, User],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      migrationsRun: false,
      synchronize: this.configService.getOrThrow<AllConfigType>(
        'database.synchronize',
        {
          infer: true,
        }
      ),
      dropSchema: false,
      logging:
        this.configService.getOrThrow<AllConfigType>('app.nodeEnv', {
          infer: true,
        }) !== Environment.Production,
      cli: {
        entitiesDir: 'src',

        subscribersDir: 'subscriber',
      },
      extra: {
        // based on https://node-postgres.com/apis/pool
        // max connection pool size
        max: this.configService.getOrThrow<AllConfigType>(
          'database.maxConnections',
          {
            infer: true,
          }
        ),
        ssl: this.configService.getOrThrow<AllConfigType>(
          'database.sslEnabled',
          { infer: true }
        )
          ? {
              rejectUnauthorized: this.configService.getOrThrow<AllConfigType>(
                'database.rejectUnauthorized',
                { infer: true }
              ),
              ca:
                this.configService.getOrThrow<AllConfigType>('database.ca', {
                  infer: true,
                }) ?? undefined,
              key:
                this.configService.getOrThrow<AllConfigType>('database.key', {
                  infer: true,
                }) ?? undefined,
              cert:
                this.configService.getOrThrow<AllConfigType>('database.cert', {
                  infer: true,
                }) ?? undefined,
            }
          : undefined,
      },
    } as TypeOrmModuleOptions;
  }
}
