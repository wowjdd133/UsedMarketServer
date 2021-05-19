import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindAllDto } from 'src/common/dto/findAll.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
    constructor(private readonly userService:UserService) {}

    @ApiOperation({
        summary: '유저 - 모두 조회',
        description: `
        \n  모든 유저 조회
        `
    })
    @Get()
    findAll(@Query() {skip, limit}:FindAllDto) {
        return this.userService.findAll({
            skip: skip,
            take: limit,
            orderBy: {
                created_at: 'asc'
            }
        });
    }
}
