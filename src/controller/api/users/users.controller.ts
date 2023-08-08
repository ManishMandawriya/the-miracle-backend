import { Body, Controller, Get, Headers, HttpStatus, Optional, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service.js';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { AuthGuard } from 'src/middleware/auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Post("/register")
    async register(@Body() body: any, @Res() res: Response) {
        await this.userService.register(body, res);
    }

    @Post("/verify-email")
    async verifyEmail(@Body() body: any, @Res() res: Response) {
        await this.userService.verifyEmail(body, res);
    }

    @Post("/login")
    async login(@Body()body:any, @Res() res: Response){
        await this.userService.login(body, res)
    }

    @UseGuards(AuthGuard)
    @Get("/profile")
    async getProfile(@Req()req:any, @Res() res: Response){
        await this.userService.profile(req, res)
    }
}
