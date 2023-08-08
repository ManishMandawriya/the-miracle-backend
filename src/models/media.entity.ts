import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Song } from './song.entity';


@Entity({ name: 'media' })
export class Media {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    media_type: string;

    @Column({ nullable: false })
    ref_id: number;

    @Column({ nullable: false })
    file_name: string;

    @Column({ nullable: false })
    extension: string;

    @Column({ nullable: false })
    file_path: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;


    // @OneToMany(() => Song, song => song.id)
    // @JoinColumn({ name: 'ref_id' }) 
    // song: Song;

    @ManyToOne(() =>Song)
    @JoinColumn({ name: 'ref_id', referencedColumnName: 'id' })
    song: Song;

}
