import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session, User } from 'src/models/index.entity';
import { MailingService } from 'src/mailing/mailing.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Session]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      global: true,
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, MailingService]
})
export class UsersModule { }
