import { Injectable } from '@nestjs/common';
import * as ejs from 'ejs'
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailingService {
    emailTrasport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.google.com",
        port: 446,
        secure: true,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    })

    async sendMail(data: any) {
        let res = {};
        try {
            const renderedTemplate = await ejs.renderFile(
                // "/var/www/html/NestJs_Projects/song-player/src/views/ejs/mail-template.ejs",
                "/var/www/html/NestJs_Projects/the-miracle-backend/src/views/ejs/mail-template.ejs",
                { message: data?.body }
            );

            const mailOptions = {
                from: process.env.MAIL_FROM_ADDRESS,
                to: data?.email,
                subject: data?.subject,
                html: renderedTemplate,
            };

            await this.emailTrasport.sendMail(mailOptions, (error: any, info: any) => {
                if (error) {
                    res = {
                        status: false,
                        message: error?.message,
                    };
                } else {
                    res = {
                        status: true,
                        message: `Message sent: ${info.response}`,
                    };
                }
            });
        } catch (err) {
            console.error("Error sending email:", err);
            res = {
                status: false,
                message: err?.message,
            };
        }
        return res;
    }

}
