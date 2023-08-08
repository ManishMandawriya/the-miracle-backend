import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from 'typeorm';
import { Song } from './index.entity';

@Entity({ name: 'playlists' })
export class Playlist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    playlist_name: string;

    @Column({ nullable: false })
    user_id: number;

    @Column({ nullable: false })
    playlist_path: string;

    // @Column()
    // songs: number[];


    @OneToMany(() => Song, song => song.playlist)
    @JoinColumn({ name: 'songs', referencedColumnName: 'id' })
    songs: Song[];


    @Column()
    playlist_image: string;

    @Column({ nullable: false })
    duration: string

    @Column({ default: true })
    status: boolean;

    @Column({ default: false })
    is_deleted: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;


    
}
