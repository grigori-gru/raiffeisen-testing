import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CreateUrlDto } from './dto';
import { UrlsService } from './urls.service';

export const urlPrefix = 'urls';

@Controller(urlPrefix)
export class UrlsController {
    constructor(private readonly urlsService: UrlsService) {}

    @Get(':urlId')
    async getTinyUrl(@Param('urlId') urlId: string, @Res() res: Response) {
        const fullUrl = await this.urlsService.getUrl(urlId);

        return res.redirect(fullUrl);
    }

    @Post()
    @ApiResponse({
        status: 201,
        description: 'Tiny url has been successfully created.',
        type: String,
    })
    async addUrl(@Body() body: CreateUrlDto, @Req() req: Request) {
        const tinyUrlPart = await this.urlsService.addUrl(body.url);

        // Host can be changed, but tiny url part is constant
        return `${req.protocol}://${req.headers.host}/${urlPrefix}/${tinyUrlPart}`;
    }
}
