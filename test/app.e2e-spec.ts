import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/modules';
import { loadDbFixtures } from './fixtures/utils';
import { getRepository } from 'typeorm';
import { Urls } from '../src/modules/urls/urls.entity';
import { CreateUrlDto } from '../src/modules/urls/dto';
import { urlPrefix } from '../src/modules/urls/urls.controller';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
                forbidNonWhitelisted: true,
                whitelist: true,
            }),
        );
        await app.init();
        await loadDbFixtures();
    });

    afterEach(async () => {
        await app.close();
    });

    describe('GET /urls/:id', () => {
        it('expect 404 if tiny url not exists in DB', () => {
            return request(app.getHttpServer())
                .get('/urls/unknownurl')
                .expect(404);
        });

        it('expect redirects to full url if tiny url exists in DB', async () => {
            const [existingUrl] = await getRepository<Urls>(Urls).find();

            await request(app.getHttpServer())
                .get(`/urls/${existingUrl.tinyUrlPart}`)
                .expect(302);

            const existingUrlAfter = await getRepository<Urls>(Urls).findOne(
                existingUrl.urlId,
            );
            expect(existingUrlAfter?.redirectCounter).toEqual(
                existingUrl.redirectCounter + 1,
            );
        });
    });

    describe('POST /urls', () => {
        it('expect 400 if url is passed without protocol', async () => {
            const body: CreateUrlDto = { url: 'www.google.com' };

            await request(app.getHttpServer())
                .post('/urls')
                .send(body)
                .expect(400);
        });

        it('expect 400 if not url is passed in body', async () => {
            const body: CreateUrlDto = { url: 'not url' };

            await request(app.getHttpServer())
                .post('/urls')
                .send(body)
                .expect(400);
        });

        it('expect 400 if localhost url is passed in body', async () => {
            const createBody: CreateUrlDto = {
                url: 'http://localhost',
            };

            await request(app.getHttpServer())
                .post('/urls')
                .send(createBody)
                .expect(400);
        });

        it('expect 201 if correct url is passed in body', async () => {
            const createBody: CreateUrlDto = {
                url: 'https://www.google.com/',
            };

            const { text } = await request(app.getHttpServer())
                .post('/urls')
                .send(createBody)
                .expect(201);

            const data = await getRepository<Urls>(Urls).findOne({
                fullUrl: createBody.url,
            });
            expect(text).toContain(`/${urlPrefix}/${data?.tinyUrlPart}`);
        });

        it('expect 200 if full url already has tiny one', async () => {
            const [existingUrl] = await getRepository<Urls>(Urls).find();
            const createBody: CreateUrlDto = {
                url: existingUrl.fullUrl,
            };

            const { text } = await request(app.getHttpServer())
                .post('/urls')
                .send(createBody)
                .expect(201);

            expect(text).toContain(`/${urlPrefix}/${existingUrl.tinyUrlPart}`);
        });
    });
});
