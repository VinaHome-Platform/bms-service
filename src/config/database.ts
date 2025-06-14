import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import configuration from './configuration';
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: configuration().database.host,
  port: configuration().database.port,
  username: configuration().database.username,
  password: configuration().database.password,
  database: configuration().database.database,
  autoLoadEntities: true,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: false,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
};
