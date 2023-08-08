import { Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { SongsService } from './songs.service';
import { Response } from 'express';
import { AuthGuard } from 'src/middleware/auth.guard';

@Controller('songs')
export class SongsController {
    constructor(
        private readonly songService: SongsService
    ) { }

    @UseGuards(AuthGuard)
    @Get("/home-page-data")
    async getHomePageData(@Res() res: Response) {
        await this.songService.getHomePageData(res)
    }

    @UseGuards(AuthGuard)
    @Get("/listen/:id")
    async listen(@Req() req: any, @Param("id") id: any, @Res() res: Response) {
        await this.songService.listenSong(id, req, res)
    }

    @UseGuards(AuthGuard)
    @Get("/history")
    async history(@Req() req: any, @Res() res: Response) {
        await this.songService.getHistory(req, res)
    }


}
