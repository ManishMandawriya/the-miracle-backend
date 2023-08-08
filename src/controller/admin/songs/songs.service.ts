import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from 'src/models/song.entity';
import { Repository } from 'typeorm';
import * as ffmpeg from 'fluent-ffmpeg';
import * as ffprobePath from '@ffprobe-installer/ffprobe';
import { Media } from 'src/models/media.entity';
import * as path from 'path';

ffmpeg.setFfprobePath(ffprobePath.path);

@Injectable()
export class SongsService {
    constructor(
        // @InjectRepository(Song) private SongModel: Repository<Song>,
        // @InjectRepository(Media) private MediaModel: Repository<Media>,
        @InjectRepository(Song)
        private readonly songRepository: Repository<Song>,
        @InjectRepository(Media)
        private readonly mediaRepository: Repository<Media>,
        // private readonly jwtService: JwtService,
    ) { }

    // async uploadSong(audioFile: any, imageFile: any, body: any, res: any) {
    //     try {
    //         const audioPath = `http://localhost/NestJs_Projects/the-miracle-backend/public/uploads/audio/${audioFile.filename}`
    //         const imagePath = `http://localhost/NestJs_Projects/the-miracle-backend/public/uploads/images/${imageFile.filename}`
    //         const duration: any = await this.getAudioDuration(audioFile.path);


    //         await this.SongModel.save({
    //             duration: duration,
    //             song_title: body.song_title,
    //             size: this.formatFileSize(audioFile.size)
    //         }).then(async (response) => {
    //             if (response) {
    //                 for (const file of [audioFile, imageFile]) {
    //                     const extension = path.extname(file.originalname).substring(1);
    //                     await this.MediaModel.save({
    //                         media_type: file.fieldname === 'audio' ? 'audio' : 'image',
    //                         ref_id: response?.id,
    //                         file_name: file.filename,
    //                         extension: extension,
    //                         file_path: file.fieldname === 'audio' ? audioPath : imagePath
    //                     });
    //                 }
    //                 return res.status(201).json({
    //                     status: true,
    //                     message: "Song uploaded successfully",
    //                     data: []
    //                 })

    //             }
    //         }).catch((err)=>{
    //             return res.status(400).json({
    //                 status: false,
    //                 message: "Something went wrong",
    //                 error: err?.message
    //             })
    //         })

    //     } catch (error) {
    //         return res.status(500).json({
    //             status: false,
    //             message: "Internal server error.",
    //             error: error?.message
    //         })
    //     }
    // }

    async uploadSong(audioFile: any, imageFile: any, body: any, res: any) {
        try {
          const audioPath = `http://localhost/NestJs_Projects/the-miracle-backend/public/uploads/audio/${audioFile.filename}`;
          const imagePath = `http://localhost/NestJs_Projects/the-miracle-backend/public/uploads/images/${imageFile.filename}`;
          const duration: any = await this.getAudioDuration(audioFile.path);
    
          const song = this.songRepository.create({
            duration: duration,
            song_title: body.song_title,
            size: this.formatFileSize(audioFile.size),
          });
    
          const savedSong = await this.songRepository.save(song);
    
          for (const file of [audioFile, imageFile]) {
            const extension = path.extname(file.originalname).substring(1);
    
            const media = this.mediaRepository.create({
              media_type: file.fieldname === 'audio' ? 'audio' : 'image',
              ref_id: savedSong.id,
              file_name: file.filename,
              extension: extension,
              file_path: file.fieldname === 'audio' ? audioPath : imagePath,
            });
    
            await this.mediaRepository.save(media);
          }
    
          return res.status(201).json({
            status: true,
            message: 'Song uploaded successfully',
            data: [],
          });
        } catch (error) {
          return res.status(500).json({
            status: false,
            message: 'Internal server error.',
            error: error?.message,
          });
        }
      }



    formatDuration = (duration: any) => {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor(duration % 60);

        const endtime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        return endtime;
    }

    getAudioDuration(filePath: string) {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(filePath, (err: any, metadata: any) => {
                if (err) {
                    console.error('Error while probing file:', err);
                    reject('Error while processing the file.');
                }
                const durationInSeconds = metadata.format.duration;
                const formatedTime = this.formatDuration(durationInSeconds)
                resolve(formatedTime)
            })
        });
    }


    formatFileSize = (sizeInBytes: any) => {
        if (sizeInBytes < 1024) {
            return `${sizeInBytes} B`;
        } else if (sizeInBytes < 1024 * 1024) {
            return `${(sizeInBytes / 1024).toFixed(2)} KB`;
        } else if (sizeInBytes < 1024 * 1024 * 1024) {
            return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
        } else {
            return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
        }
    }


}
