import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column({ nullable: true })
    mobile_number: string

    @Column()
    password: string

    @Column({ nullable: true })
    profile_image: string

    @Column()
    otp: string

    @Column({ nullable: true })
    remember_token: string

    @Column({ type: 'json', nullable: true })
    last_played_song: Record<string, any>  

    @Column({ default: true })
    status: boolean;

    @Column({ default: false })
    is_verified: boolean;


    @Column({ default: false })
    is_deleted: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

}
