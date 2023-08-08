import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { Media } from 'src/models/media.entity';
import { RecentPlayed } from 'src/models/recent.entity';
import { Song } from 'src/models/song.entity';
import { User } from 'src/models/user.entity';
import { json } from 'stream/consumers';
import { Repository } from 'typeorm';

@Injectable()
export class SongsService {
    constructor(
        @InjectRepository(Song) private songRepository: Repository<Song>,
        @InjectRepository(Media) private mediaRepository: Repository<Media>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(RecentPlayed) private recentPlayedRepository: Repository<RecentPlayed>,
    ) { }

    async getHomePageData(res: Response) {
        try {
            const top15Songs = await this.songRepository.find({
                where: { is_deleted: false },
                order: {
                    listen_by: 'DESC'
                },
                take: 15,
            })

            const mediaData = await this.mediaRepository.find({});

            const mediaMap = new Map();
            mediaData.forEach(media => {
                mediaMap.set(media.ref_id, media);
            });

            const songsWithMedia = top15Songs.map(song => ({
                ...song,
                media: mediaMap.get(song.id)
            }));



            const data = [
                {
                    data: songsWithMedia,
                    section_type: 1,
                    title: "Home Banner"
                },
                {
                    data: songsWithMedia,
                    section_type: 2,
                    title: "Recently Played"
                },
                {
                    data: songsWithMedia,
                    section_type: 3,
                    title: "Weekly Top 15"
                },
                {
                    data: songsWithMedia,
                    section_type: 4,
                    title: "Weekly Top 15"
                },
                {
                    data: songsWithMedia,
                    section_type: 5,
                    title: "Weekly Top 15"
                },
                {
                    data: songsWithMedia,
                    section_type: 6,
                    title: "Weekly Top 15"
                },
                {
                    data: songsWithMedia,
                    section_type: 7,
                    title: "Weekly Top 15"
                },
                {
                    data: songsWithMedia,
                    section_type: 8,
                    title: "Weekly Top 15"
                }
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

    async listenSong(req: any, res: Response) {

        try {
            const song = await this.songRepository.findOne({ where: { id: req?.body?.id } });
            const isRecent = await this.recentPlayedRepository.findOne({ where: { song_id: req?.body?.id, user_id: req.user.id } })
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
                await this.recentPlayedRepository.save({ song_id: req?.body?.id, user_id: req.user.id })
            }
            song.listen_by += 1;
            await this.songRepository.save(song);
            await this.userRepository.update({ id: req.user.id }, { last_played_song: req?.body })

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
