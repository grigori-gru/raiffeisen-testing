import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { UrlsModule } from './urls/urls.module';
import { LoggerMiddleware } from '../common/middlewares';

@Module({
    imports: [
        ConfigModule.forRoot({
            ignoreEnvFile: true,
            load: [configuration],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) =>
                configService.get('database') as TypeOrmModuleOptions,
        }),
        ConfigModule,
        UrlsModule,
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
