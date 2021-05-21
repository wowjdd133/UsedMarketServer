import { Body, Controller, Get, Patch, Query, Req, UploadedFile, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindAllDto } from 'src/common/dto/findAll.dto';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt-guard';
import { ChangeUserProfileDto } from './dto/changeProfile.dto';

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

    @ApiOperation({
        summary: '프로필 - 프로필 수정',
        description: `
        \n 해당 토큰의 유저 프로필 수정
        `
    })
    @UseGuards(JwtGuard)
    @Patch('/profile')
    changeUserProfile(@Req() req, @Body() dto: ChangeUserProfileDto, @UploadedFile('file') file: Express.Multer.File ) {
       const user = req.user;
       
       return this.userService.changeProfile(user.id, dto, file);
    }
}
