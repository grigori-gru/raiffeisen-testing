import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const env = process.env.NODE_ENV || 'development';
const SOURCE_PATH = env === 'test' ? 'src' : 'dist';
const migrations = [`src/migrations/*.ts`];

export default (
    runMigration?: boolean,
): { database: TypeOrmModuleOptions } => ({
    database: {
        type: 'postgres',
        host: process.env.DATABASE_HOST!,
        port:
            (process.env.DATABASE_PORT &&
                parseInt(process.env.DATABASE_PORT, 10)) ||
            5432,
        username: process.env.POSTGRES_USER!,
        password: process.env.POSTGRES_PASSWORD!,
        database: process.env.POSTGRES_DB!,
        entities: [`${SOURCE_PATH}/modules/**/**.entity{.ts,.js}`],
        migrations: runMigration ? migrations : [],
        synchronize: env === 'test',
        dropSchema: env === 'test',
        // migrationsRun: env === 'test',
    },
});
