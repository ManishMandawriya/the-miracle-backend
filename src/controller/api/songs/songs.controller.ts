import { Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { SongsService } from './songs.service';
import { Response, Request } from 'express';
import { AuthGuard } from 'src/middleware/auth.guard';

@Controller('songs')
export class SongsController {
    constructor(
        private readonly songService: SongsService
    ) { }

    // @UseGuards(AuthGuard)
    @Get("/home-page-data")
    async getHomePageData(@Req() req: any, @Res() res: Response) {
        await this.songService.getHomePageData(req, res)
    }

    @UseGuards(AuthGuard)
    @Post("/listen")
    async listen(@Req() req: any, @Res() res: Response) {
        await this.songService.listenSong(req, res)
    }

    @UseGuards(AuthGuard)
    @Get("/recent")
    async history(@Req() req: any, @Res() res: Response) {
        await this.songService.getHistory(req, res)
    }


}
