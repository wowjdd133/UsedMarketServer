import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DistrictService } from './district.service';

@Controller('districts')
@ApiTags('districts')
export class DistrictController {
    constructor(
        private readonly districtService:DistrictService
    ){}

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
