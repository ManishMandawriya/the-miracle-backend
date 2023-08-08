import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Response } from 'express';
import { AdminAuthGuard } from 'src/middleware/admin.auth.guard';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminServices: AdminService) { }

    @Post("/register")
    async register(@Body() body: any, @Res() res: Response) {
        await this.adminServices.register(body, res)
    }

    @Post("/login")
    async login(@Body() body: any, @Res() res: Response) {
        await this.adminServices.login(body, res)
    }

    @UseGuards(AdminAuthGuard)
    @Get("/profile")
    async getProfile(@Req() req: Request, @Res() res: Response) {
        await this.adminServices.profile(req, res)
    }

}
