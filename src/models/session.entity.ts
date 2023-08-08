import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from 'typeorm';


@Entity({ name: 'sessions' })
export class Session {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    user_id: number;

    @Column({ nullable: false })
    token: string;

    @Column()
    user_type:string

    @Column({ default: false })
    is_expired: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

}
