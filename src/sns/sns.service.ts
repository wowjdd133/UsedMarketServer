import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { sendCodeDto } from './dto/sendCode.dto';
import * as AWS from 'aws-sdk'
import { ConfigService } from '@nestjs/config';
import { SNS } from 'aws-sdk';
import { PublishResponse } from 'aws-sdk/clients/sns';

@Injectable()
export class SnsService {

    private readonly _sns: AWS.SNS;

    constructor(
        private readonly prisma:PrismaService,
        private readonly configService:ConfigService
    ) {
       AWS.config.update({
           credentials: {
               accessKeyId: configService.get("AWS_SNS_ACCESS_ID"),
               secretAccessKey: configService.get("AWS_SNS_SECRET_KEY")
           },
           region: configService.get("AWS_SNS_REGION")
       }) 

       console.log()

       this._sns = new SNS({
           apiVersion: '2010-03-31',  
       })
    }

    async sendCode({deviceId, phoneNumber}:sendCodeDto) {
        try {
            let code = Math.floor(Math.random() * 10000)+1000;
            if(code >= 10000) code -= 1000;

            const korPhoneNumber = "82" + phoneNumber;

            return this._sns
                .publish({
                    Message: code.toString(),
                    PhoneNumber: korPhoneNumber,
                })
                .promise()
                .then(async (info: PublishResponse) => {

                    console.log(info);

                    await this.createVerifiation(deviceId, code);

                    return {
                        status: HttpStatus.OK,
                        message: "메시지 전송 성공",
                        data: info
                    }
                })
                .catch((err) => {
                    console.error(err);
                    throw new HttpException({
                        status: HttpStatus.BAD_REQUEST,
                        message: '메시지 전송 실패',
                        data: err
                    }, HttpStatus.BAD_REQUEST)
                })
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async createVerifiation(deviceId: string, code: number) {
        try {
            const verification = await this.prisma.verification.create({
                data: {
                    code: code,
                    device_id: deviceId
                }
            });

            console.log(verification);

            return true;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}
