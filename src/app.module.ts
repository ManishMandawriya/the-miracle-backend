import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
const envModule = ConfigModule.forRoot({ isGlobal: true })
import { typeormConnectingConfig } from './config/typeorm.config';
import { UsersModule } from './controller/api/users/users.module';
import { UsersController } from './controller/api/users/users.controller';
import { UsersService } from './controller/api/users/users.service.js';
import { Admin, Media, Playlist, RecentPlayed, Session, Song, User } from './models/index.entity';
import { MailingService } from './mailing/mailing.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SongsService } from './controller/api/songs/songs.service';
import { SongsController } from './controller/api/songs/songs.controller';
import { SongsModule } from './controller/api/songs/songs.module';
import { AdminController } from './controller/admin/admin/admin.controller';
import { AdminService } from './controller/admin/admin/admin.service';
import { AdminModule } from './controller/admin/admin/admin.module';
import { UserController } from './controller/admin/user/user.controller';
import { UserService } from './controller/admin/user/user.service';
import { UserModule } from './controller/admin/user/user.module';
import { SongsModule as AdminSongsModule } from './controller/admin/songs/songs.module';
import { MulterModule } from '@nestjs/platform-express';
import { JWT_SECRET_KEY } from './config/config.config';

@Module({
  imports: [
    envModule,
    TypeOrmModule.forRoot(typeormConnectingConfig),
    TypeOrmModule.forFeature([User, Song, Session, Playlist, Admin, RecentPlayed, Media]),
    UsersModule,
    JwtModule.register({
      // secret: process.env.JWT_SECRET_KEY,
      secret: JWT_SECRET_KEY,
      global: true,
      signOptions: {
        expiresIn: '7d',
      },
    }),
    MulterModule.register({
      dest: '/var/www/html/NestJs_Projects/the-miracle-backend/public/uploads/media',
    }),
    SongsModule,
    AdminSongsModule,
    AdminModule,
    UserModule,
  ],
  controllers: [UsersController, SongsController, AdminController, UserController,],
  providers: [UsersService, MailingService, SongsService, AdminService, UserService,],
})
export class AppModule { }

