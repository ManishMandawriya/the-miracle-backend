import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User, Song, Playlist, Session, Admin, RecentPlayed, Media } from "../models/index.entity"
import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } from "./config.config";


export const typeormConnectingConfig: TypeOrmModuleOptions = {
    type: "mysql",
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    entities: [User, Song, Playlist, Session, Admin , RecentPlayed,Media],
    synchronize: true,
    logging: true,
};












// export const typeormConnectingConfig: TypeOrmModuleOptions = {
//     type: "mysql",
//     host: process.env.HOST,
//     port: parseInt(process.env.DB_PORT),
//     username: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME,
//     entities: [User, Song, Playlist, Session, Admin , RecentPlayed,Media],
//     synchronize: true,
//     logging: true,
// };