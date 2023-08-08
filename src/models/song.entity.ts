import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Playlist, Media } from './index.entity';

@Entity({ name: 'songs' })
export class Song {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    song_title: string;

    @Column({ nullable: false })
    size: string;

    @Column({ default: 0 })
    listen_by: number

    @Column({ nullable: true })
    genre: string;

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

    @ManyToOne(() => Playlist, playlist => playlist.songs)
    playlist: Playlist;

    // @ManyToOne(() => Media)
    // @JoinColumn({ name: 'id', referencedColumnName: 'ref_id' })
    // media: Media;

    // @ManyToOne(() => Media)
    // @JoinColumn({ name: 'id', referencedColumnName: 'ref_id' })
    // bannner: Media;
}