import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Song } from './song.entity';


@Entity({ name: 'media' })
export class Media {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    ref_id: number;

    @Column({ nullable: false })
    audio_file_path: string;

    @Column({ nullable: false })
    image_file_path: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => Song)
    @JoinColumn({ name: 'ref_id', referencedColumnName: 'id' })
    song: Song;
}
