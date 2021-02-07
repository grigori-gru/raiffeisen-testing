import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('urls', { schema: 'tiny_urls' })
export class Urls {
    @PrimaryGeneratedColumn({ type: 'integer', name: 'url_id' })
    urlId: number;

    @Column('text', { name: 'tiny_url_part', unique: true })
    tinyUrlPart: string;

    @Column('text', { name: 'full_url', unique: true })
    fullUrl: string;

    @Column('integer', { name: 'redirect_counter', default: 0 })
    redirectCounter: number;
}
