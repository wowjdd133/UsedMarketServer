import { Body, Controller, Get, Param, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Request } from 'express';
import { boolean } from 'joi';
import { JwtGuard } from 'src/auth/guards/jwt-guard';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { ContentService } from './content.service';
import { CreateProductDto } from './dto/create-product.dto';
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
    async getAllProduct(@Query() {districtId, limit, skip}:GetAllProductDto) {
        return this.contentService.getAllProducts({
            skip: skip,
            take: limit,
            where: {
                district_id: districtId
            },
            orderBy: { 
                created_at: 'desc'
            },
        });
    }

    @ApiOperation({
        summary: '상품 - 상품 단일 조회',
        description: `
            id에 따른 상품 단일 조회
        `
    })
    @Get('/:id')
    @UseGuards(JwtGuard)
    async getOneProduct(@Param('id') id:number) {
        return this.contentService.getOneProduct({
            where: {
                id: id
            },
        })
    }

    @Post()
    @UseGuards(JwtGuard)
    @ApiBody({
        type: CreateProductDto,
        schema: {
            type: 'object',
            properties: {
                files:{
                    type: 'string',
                    format: 'binary'
                }
            },
            
        },
    })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FilesInterceptor)
    async postProduct(@UserDecorator() user:User, @UploadedFiles() files:Express.Multer.File[],@Body() { categoryId, price, title, districtId, isAbleOffer, description }:CreateProductDto) {
        return this.contentService.postProduct({
            category: {
                connect: {
                    id: categoryId
                }
            },
            district: {
                connect: {
                    id: districtId
                }
            },
            user: {
                connect: {
                    id: user.id
                }
            },
            price: price,
            title: title,
            is_able_offer: isAbleOffer,
            description: description,
        }, files);
    }
}
