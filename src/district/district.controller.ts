import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DistrictService } from './district.service';
import {GetNearDistrict} from './dto/getNearDistrict.dto';
import { FindAllDto } from 'src/common/dto/findAll.dto';
import { SearchAllDto } from 'src/common/dto/searchAll.dto';

@Controller('districts')
@ApiTags('districts')
export class DistrictController {
    constructor(
        private readonly districtService:DistrictService
    ){}

    @ApiOperation({
        summary: '시군구 - 가까운 구 가져오기',
        description: `
        \n 좌표를 기반으로 가까운 구를 가져옴
        `
    })
    @Get('near')
    getNearDistrict(@Query() query: GetNearDistrict ) {
        return this.districtService.getNearDistrict(query);
    }

    @ApiOperation({
        summary: '시군구 - 검색어 구 가져오기',
        description: `
        \n 검색어를 기반으로 구를 가져옴
        `
    })
    @Get('/search')
    searchDistrict(@Query() {limit, skip, text}: SearchAllDto) {
        return this.districtService.findAll({
            skip,
            take: limit,
            where: {
                OR: [{
                    sig_kor_name: {
                        contains: text
                    },
                },
                {
                    sig_eng_name: {
                        contains: text
                    }
                }]
            },
        })
    }

    @ApiOperation({
        summary: '시군구 - 구 init api',
        description: `
        \n2014 서울시 시군구 데이터를 기반으로
        \ninit하는 api
        `
    })
    @Post('init')
    initDistrict() {
        return this.districtService.initDistrict();
    }


}
