import { Body, Controller, Post } from '@nestjs/common';
import { sendCodeDto } from './dto/sendCode.dto';
import { SnsService } from './sns.service';

@Controller('sns')
export class SnsController {

    constructor(
        private readonly snsService:SnsService
    ) {}

    @Post('code')
    sendCode(@Body() dto:sendCodeDto) {
        return this.snsService.sendCode(dto);
    }
}