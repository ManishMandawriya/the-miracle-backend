import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User, Song, Playlist, Session, Admin, RecentPlayed, Media } from "../models/index.entity"

export const typeormConnectingConfig: TypeOrmModuleOptions = {
    type: "mysql",
    host: process.env.HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [User, Song, Playlist, Session, Admin , RecentPlayed,Media],
    synchronize: true,
    logging: true,
};