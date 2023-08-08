// src/songs/song.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('songs')
export class UploadSongDto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    bannerPath: string;

    @Column()
    songFilePath: string;
}
