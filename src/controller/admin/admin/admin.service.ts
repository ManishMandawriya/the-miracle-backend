import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Admin, Session } from 'src/models/index.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin) private AdminModel: Repository<Admin>,
        @InjectRepository(Session) private SessionModel: Repository<Session>,
        private readonly jwtService: JwtService,

    ) { }


    async register(body: any, res: Response) {
        try {
            const isAdmin = await this.AdminModel.findOne({ where: { email: body?.email } })
            if (isAdmin) {
                return res.status(403).json({
                    status: false,
                    message: "Email address already exist."
                })
            } else {
                const hashPassword = await bcrypt.hash(body?.password, 8)
                body.password = hashPassword
                const createAdmin = await this.AdminModel.save(body)
                if (createAdmin) {
                    return res.status(200).json({
                        status: true,
                        message: "Registered successfully.",
                        data: []
                    })
                } else {
                    return res.status(400).json({
                        status: false,
                        message: "Something went wrong, try again later.",
                        data: []
                    })
                }

            }
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "Internal server error.",
                error: error?.message
            })
        }

    }

    async login(body: any, res: any) {
        try {
            const user = await this.AdminModel.findOne({ where: { email: body?.email } })
            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: "Please enter a valid email address."
                })
            } else {
                const mtchPass = await bcrypt.compare(body.password, user.password)
                if (mtchPass) {
                    const response = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        createdAt: user.createdAt
                    }
                    const access_token = await this.jwtService.signAsync(response)
                    const isSession = await this.SessionModel.findOne({ where: { user_id: user?.id, is_expired: false } })

                    if (isSession) {
                        await this.SessionModel.update({ id: isSession?.id }, { is_expired: true })
                    }
                    await this.SessionModel.save({ user_id: user?.id, token: access_token, user_type:"admin" })

                    return res.status(200).json({
                        status: true,
                        message: "Login successfully",
                        data: user,
                        access_token: access_token
                    })
                }
                else {
                    return res.status(203).json({
                        status: false,
                        message: "Please enter a valid password.",
                        data: []
                    })
                }
            }
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "Internal server error.",
                error: error?.message
            })
        }

    }
    async profile(req: any, res: any) {
        try {
            await this.AdminModel.findOne({ where: { id: req?.user?.id } }).then((response) => {
                return res.status(200).json({
                    status: true,
                    message: "Profile get successfully",
                    data: response
                })
            }).catch((err: any) => {
                return res.status(400).json({
                    status: false,
                    message: "Something went wrong",
                    error: err?.message
                })
            })

        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "Internal server error.",
                error: error?.message
            })
        }
    }



}
