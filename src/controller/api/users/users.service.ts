import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { MailingService } from 'src/mailing/mailing.service';
import { Session, User } from 'src/models/index.entity';
import { OTPTEMPLATE } from 'src/views/html';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private UserModel: Repository<User>,
        @InjectRepository(Session) private SessionModel: Repository<Session>,
        private readonly mailService: MailingService,
        private readonly jwtService: JwtService,
    ) { }

    async register(body: any, res: Response) {
        try {
            const isUser = await this.UserModel.findOne({ where: { email: body.email } })
            if (isUser) {
                return res.status(403).json({
                    status: false,
                    message: "Email address already exist."
                })
            } else {

                const otp = this.otpGenerator(4)
                let TagData = { "{##name##}": body.name, "{##otp##}": otp }
                const mailBody = await this.StringReplace(TagData, OTPTEMPLATE)

                let mailData = {
                    email: body.email,
                    subject: "Email verification",
                    body: mailBody
                }
                const mailSent = this.mailService.sendMail(mailData)
                if (mailSent) {
                    const hashPassword = await bcrypt.hash(body?.password, 8)

                    body.password = hashPassword
                    const createUser = await this.UserModel.save({ ...body, otp: otp })

                    if (createUser) {
                        return res.status(200).json({
                            status: true,
                            message: "Registered successfully, an otp has sent to you email address.",
                            data: []
                        })
                    } else {
                        return res.status(400).json({
                            status: false,
                            message: "Something went wrong, try again later.",
                            data: []
                        })
                    }
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

    async verifyEmail(body: any, res: Response) {
        try {
            const user: any = await this.UserModel.findOne({ where: { email: body?.email } })

            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: "User not found."
                })
            } else if (user.is_verified === true) {
                return res.status(200).json({
                    status: false,
                    message: "Account already verified."
                })
            } else {
                if (body.otp == user?.otp) {

                    const response = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        createdAt: user.createdAt
                    }
                    const access_token = await this.jwtService.signAsync(response)
                    await this.UserModel.update({ email: body?.email }, { is_verified: true })
                    user.is_verified = true
                    return res.status(200).json({
                        status: true,
                        message: "Email verified successfully.",
                        data: user,
                        access_token: access_token
                    })
                } else {
                    return res.status(400).json({
                        status: false,
                        message: "Please enter a valid otp."
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
            const user = await this.UserModel.findOne({ where: { email: body?.email } })
            if (!user) {
                return res.status(401).json({
                    status: false,
                    message: "Please enter a valid email address."
                })
            } else if (user.is_verified === false) {
                return res.status(203).json({
                    status: false,
                    message: "Your account is not verified at yet."
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
                    await this.SessionModel.save({ user_id: user?.id, token: access_token, user_type: "user" })

                    return res.status(200).json({
                        status: true,
                        message: "Login successfully",
                        data: user,
                        access_token: access_token
                    })
                }
                else {
                    return res.status(401).json({
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
            await this.UserModel.findOne({ where: { id: req?.user?.id } }).then((response) => {
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


    otpGenerator = (limit: any) => {
        var digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < limit; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
    }

    StringReplace = async (TagData: any, FullHtml: any) => {
        for (let TagKey in TagData) {
            FullHtml = FullHtml.replace(TagKey, TagData[TagKey])
        }
        return FullHtml;
    };


}
