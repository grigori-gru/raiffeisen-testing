/* eslint-disable @typescript-eslint/camelcase */
import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class CreateUrlDto {
    @ApiProperty()
    @IsUrl({ require_protocol: true })
    url: string;
}
