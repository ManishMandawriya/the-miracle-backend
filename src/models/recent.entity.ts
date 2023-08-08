import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Song } from './song.entity';


@Entity({ name: 'recent-played' })
export class RecentPlayed {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    user_id: number;

    @Column({ nullable: false })
    song_id: number;

    @Column({ default: false })
    is_deleted: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;


    @ManyToOne(() => Song, song => song.id)
    @JoinColumn({ name: 'song_id' }) 
    song: Song;
}
