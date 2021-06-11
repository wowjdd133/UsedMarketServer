import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt-guard';
import { ContentService } from './content.service';
import { GetAllProductDto } from './dto/get-all-product.dto';

@Controller('contents')
@ApiTags('contents')
@ApiCookieAuth('Authentication')
export class ContentController {
    constructor(
        private readonly contentService:ContentService
    ) {}

    @ApiOperation({
        summary: '상품 - 상품 리스트 조회',
        description: `
            \n  district id에 따른 상품 리스트 조회
        `
    })
    @Get()
    @UseGuards(JwtGuard)
    async getAllProduct(@Req() req:Request, @Query() {districtId, limit, skip}:GetAllProductDto) {

        const {user} = req;

        console.log(user);

        // return this.contentService.findAll({
        //     skip: skip,
        //     take: limit,
        //     where: {
        //         district_id: districtId
        //     },
        //     orderBy: { 
        //         created_at: 'desc'
        //     },
        //     userId: user.id
        // })
    }

    // @Post()
    // @UseGuards(JwtGuard)
    // async postProduct(@Req()  req:Request) {
    //     const {user} = req;

    //     return this.contentService.createProduct({
            
    //     })
    // }
}
