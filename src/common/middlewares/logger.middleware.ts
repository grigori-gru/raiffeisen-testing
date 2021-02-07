import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Response, NextFunction, Request } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger(LoggerMiddleware.name, true);

    use(req: Request, res: Response, next: NextFunction): void {
        const startRequest = new Date().getTime();
        res.on('finish', () => {
            const endResponse = new Date().getTime();
            this.logger.log(
                `HTTP Status ${res.statusCode} for ${req.method} ${
                    req.url
                } >>>> ${endResponse - startRequest} ms`,
            );
        });
        next();
    }
}
