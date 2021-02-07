import { MigrationInterface, QueryRunner } from 'typeorm';

export class DbInit1612556601220 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.connection.query(
            `CREATE SCHEMA IF NOT EXISTS tiny_urls;

             CREATE SEQUENCE IF NOT EXISTS auto_url_id;
             CREATE TABLE IF NOT EXISTS tiny_urls.urls (
                    url_id integer NOT NULL DEFAULT nextval('auto_url_id'),
                    tiny_url_part text NOT NULL UNIQUE,
                    full_url text NOT NULL UNIQUE,
                    redirect_counter integer NOT NULL DEFAULT 0,
                    CONSTRAINT url_id_pk PRIMARY KEY (url_id)
             );`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.connection.query(
            `DROP SCHEMA IF NOT EXISTS tiny_urls;`,
        );
    }
}
