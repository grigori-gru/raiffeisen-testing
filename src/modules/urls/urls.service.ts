import {
    CACHE_MANAGER,
    Inject,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { getRandomWord } from '../../common/utils';
import { Urls } from './urls.entity';

@Injectable()
export class UrlsService {
    private readonly logger = new Logger(UrlsService.name);

    constructor(
        @InjectRepository(Urls)
        private readonly urlsRepository: Repository<Urls>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    private async incrRedirectCounter(urlId: number) {
        await this.urlsRepository
            .createQueryBuilder('urls')
            .update(Urls)
            .whereInIds(urlId)
            .set({ redirectCounter: () => `redirect_counter + 1` })
            .execute();
    }

    private async findUrlData(
        url: string,
        type: 'fullUrl' | 'tinyUrlPart' = 'tinyUrlPart',
    ) {
        const cachedData = await this.cacheManager.get<Urls>(url);
        if (cachedData) {
            return cachedData;
        }

        const data = await this.urlsRepository.findOne({ [type]: url });
        if (data) {
            await this.cacheManager.set(data.tinyUrlPart, data);
            await this.cacheManager.set(data.fullUrl, data);

            return data;
        }
    }

    async getUrl(tinyUrlPart: string) {
        const data = await this.findUrlData(tinyUrlPart);
        if (!data) {
            throw new NotFoundException('Tiny url not found');
        }
        await this.incrRedirectCounter(data.urlId);

        return data.fullUrl;
    }

    async addUrl(fullUrl: string) {
        const urlData = await this.findUrlData(fullUrl, 'fullUrl');
        if (urlData) {
            return urlData.tinyUrlPart;
        }
        const tinyUrlPart = getRandomWord();
        await this.urlsRepository.save({ fullUrl, tinyUrlPart });

        this.logger.log(`Tiny part ${tinyUrlPart} is saved for url ${fullUrl}`);

        return tinyUrlPart;
    }
}
