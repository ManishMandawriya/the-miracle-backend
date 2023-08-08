import { Body, Controller, Post, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { SongsService } from './songs.service';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AdminAuthGuard } from 'src/middleware/admin.auth.guard';
import { extname, join } from 'path';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { UploadSongDto } from 'src/dto/upload-song.dto';
import { Song } from 'src/models/song.entity';

@Controller('songs')
export class SongsController {
    constructor(private readonly songService: SongsService) { }

    // @UseGuards(AdminAuthGuard)
    // @Post('/upload')
    // @UseInterceptors(FileInterceptor("audio"))
    // @UseInterceptors(FileInterceptor("image"))
    // async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: any, @Res() res: Response) {
    //     await this.songService.uploadSong(file, body, res)
    // }


    @Post('/upload')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'audio', maxCount: 1 },
        { name: 'image', maxCount: 1 },
    ]))
    async uploadFiles(
        @UploadedFiles() files: Record<string, Express.Multer.File[]>,
        @Body() body: any,
        @Res() res: Response
    ) {
        const audioFile = files['audio'][0];
        const imageFile = files['image'][0];

        await this.songService.uploadSong(audioFile, imageFile, body, res);
    }

    // @Post('/upload')
    // @UseInterceptors(
    //     FileInterceptor('audio'),
    //     FileInterceptor('image'),
    // )
    // async uploadFiles(
    //     @UploadedFile() audio: Express.Multer.File,
    //     @Res() res: Response,
    // ) {
    //     console.log("imageFile>>>>>>>>>>>>>>>>>>>>>>", audio);

    //     await this.songService.uploadSong(audio, '', res);
    // }
}
