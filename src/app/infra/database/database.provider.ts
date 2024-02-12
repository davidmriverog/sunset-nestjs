import { DataSource, getMetadataArgsStorage } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from './database.strategy';

export const DatabaseProvider = [
  {
    provide: DataSource,
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        applicationName: 'Sunset-API',
        url: configService.get('DATABASE_URL'),
        entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
        synchronize: true,
        logging: Boolean(configService.get('DB_LOGGING')),
        namingStrategy: new SnakeNamingStrategy(),
        useUTC: true,
      });

      if (!dataSource.isInitialized) await dataSource.initialize();

      return dataSource;
    },
    inject: [ConfigService],
  },
];
