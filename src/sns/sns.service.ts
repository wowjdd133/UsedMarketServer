import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { sendCodeDto } from './dto/sendCode.dto';
import * as AWS from 'aws-sdk'
import { ConfigService } from '@nestjs/config';
import { SNS } from 'aws-sdk';
import { PublishResponse } from 'aws-sdk/clients/sns';
import axios from 'axios';
import { ErrorStatus } from 'src/common/enums/errorStatus.enum';

@Injectable()
export class SnsService {

    constructor(
        private readonly prisma:PrismaService,
        private readonly configService:ConfigService
    ) {}

    async sendCode({deviceId, phoneNumber}:sendCodeDto) {
        try {
            let code = Math.floor(Math.random() * 10000)+1000;
            if(code >= 10000) code -= 1000;

            const now = new Date();

            const data = await axios.post(`https://api-sms.cloud.toast.com/sms/v2.4/appKeys/${this.configService.get('NHN_SMS_APP_KEY')}/sender/sms`, {
                body: `테스트 해볼게영 마켓 인증 번호는 ${code}입니다.`,
                sendNo: this.configService.get("MY_PHONE_NUMBER"),
                requestDate: `${now.getFullYear()}-${`0${now.getMonth() + 1}`.slice(-2)}-${`0${now.getDate()}`.slice(-2)} ${now.getHours()}`,
                recipientList: [{
                    recipienNo: phoneNumber,
                    countryCode: "82",
                    internationalRecipientNo: "82" + phoneNumber,
                }],
                userId: "admin"
            }, {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            })

            if(data.data) {
                if(data.data.header.isSuccessful) {
                    await this.createVerifiation(deviceId, code);
                }

                //유효하지 않은 휴대폰 번호 = -2019
                if(data.data.header.resultCode === -2019) {
                    throw new HttpException({
                        status: ErrorStatus.PHONE_NUMBER_NOT_VALID,
                        message: "폰 번호가 유효하지 않습니다."
                    }, HttpStatus.BAD_REQUEST)
                }
            } else {
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
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
