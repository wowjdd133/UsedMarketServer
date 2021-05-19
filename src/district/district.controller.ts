import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DistrictService } from './district.service';
import {GetNearDistrict} from './dto/getNearDistrict.dto';

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
