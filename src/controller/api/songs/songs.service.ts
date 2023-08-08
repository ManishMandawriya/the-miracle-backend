import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { RecentPlayed } from 'src/models/recent.entity';
import { Song } from 'src/models/song.entity';
import { json } from 'stream/consumers';
import { Repository } from 'typeorm';

@Injectable()
export class SongsService {
    constructor(
        @InjectRepository(Song) private songRepository: Repository<Song>,
        @InjectRepository(RecentPlayed) private recentPlayedRepository: Repository<RecentPlayed>
    ) { }

    async getHomePageData(res: Response) {
        try {
            const top15Songs = await this.songRepository.find({
                where: { is_deleted: false },
                order: {
                    listen_by: 'DESC'
                },
                take: 15
            })

            const image_details = {
                file_name: "image.jpg",
                file_path: "/images/image.jpg"
            };

            const audio_details = {
                file_name: "song.mp3",
                file_path: "/audio/song.mp3"
            };
            const data = [
                {
                    data: top15Songs,
                    section_type: 1,
                    title: "Home Banner"
                },
                // {
                //     data: top15Songs,
                //     section_type: 2,
                //     title: "Recently Played"
                // },
                // {
                //     data: top15Songs,
                //     section_type: 3,
                //     title: "Weekly Top 15"
                // }
            ]
            return res.status(200).json({
                status: true,
                message: 'Home list get successfully.',
                data: data
            });

            // if (top15Songs) {
            // } else {
            //     return res.status(400).json({
            //         status: false,
            //         message: 'Something went wrong.',
            //         data: []
            //     });
            // }
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'Something went wrong.',
                error: error?.message
            });
        }
    }

    async listenSong(id: any, req: any, res: Response) {
        try {
            const song = await this.songRepository.findOne({ where: { id } });
            const isRecent = await this.recentPlayedRepository.findOne({ where: { song_id: id, user_id: req.user.id } })
            if (!song) {
                return res.status(400).json({
                    status: false,
                    message: 'Song not found.'
                });
            }
            if (isRecent) {
                isRecent.updatedAt = new Date()
                await this.recentPlayedRepository.save(isRecent)
            } else {
                await this.recentPlayedRepository.save({ song_id: id, user_id: req.user.id })
            }
            song.listen_by += 1;
            await this.songRepository.save(song);

            return res.status(200).json({
                status: true,
                message: 'Success.',
                data: []
            });

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'Something went wrong.',
                error: error?.message
            });
        }
    }

    // async getHistory(req: any, res: Response) {
    //     try {
    //         const page = parseInt(req.query.page, 10) || 1;
    //         const limit = parseInt(req.query.limit, 10) || 10;
    //         const offset = (page - 1) * limit;

    //         const getHistory = await this.recentPlayedRepository.find({
    //             where: { user_id: req.user.id },
    //             take: limit,
    //             skip: offset,
    //         });
    //         const totalCount = await this.recentPlayedRepository.count({ where: { user_id: req.user.id } });

    //         return res.status(200).json({
    //             status: true,
    //             data: getHistory,
    //             page,
    //             limit,
    //             totalCount,
    //         });

    //     } catch (error) {
    //         return res.status(500).json({
    //             status: false,
    //             message: 'Something went wrong.',
    //             error: error?.message
    //         });
    //     }
    // }


    async getHistory(req: any, res: Response) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const offset = (page - 1) * limit;

            const [getHistory, totalCount] = await this.recentPlayedRepository.findAndCount({
                where: { user_id: req.user.id },
                take: limit,
                skip: offset,
                relations: ['song'],
            });

            return res.status(200).json({
                status: true,
                data: getHistory,
                page,
                limit,
                totalCount,
            });

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: 'Something went wrong.',
                error: error?.message
            });
        }
    }

}
