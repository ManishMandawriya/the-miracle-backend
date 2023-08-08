import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Session, User } from 'src/models/index.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @InjectRepository(User) private UserModel: Repository<User>,
        @InjectRepository(Session) private SessionModel: Repository<Session>,
        private jwtService: JwtService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET_KEY,
            });

            const userExist = await this.UserModel.findOne({ where: { id: payload.id } });
            if (userExist) {
                const isSession = await this.SessionModel.findOne({
                    where: { user_id: payload.id, is_expired: false, token: token, user_type: "user" },
                });

                if (isSession) {
                    request['user'] = payload;
                } else {
                    throw new UnauthorizedException('Session has expired.');
                }
            } else {
                throw new UnauthorizedException('User account not found.');
            }
        } catch (error) {
            if (error.name === 'TokenExpiredError' || (error.name === 'JsonWebTokenError' && error.message === 'jwt expired')) {
                throw new UnauthorizedException('Session has expired.');
            } else if (error.name === 'UnauthorizedException') {
                throw new UnauthorizedException(error.message);
            } else {
                throw new UnauthorizedException('Invalid token.');
            }
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
