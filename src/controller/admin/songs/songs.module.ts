import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { Media, Song } from 'src/models/index.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Song, Media]),
    MulterModule.register(multerConfig)
  ],
  providers: [SongsService],
  controllers: [SongsController]
})
export class SongsModule { }
