import { CacheModule, Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Urls } from './urls.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Urls]), CacheModule.register()],
    providers: [UrlsService],
    controllers: [UrlsController],
})
export class UrlsModule {}
