import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { RegisterDto } from './register.dto';

class PickLoginDto extends PickType(RegisterDto, ['deviceId', 'phoneNumber']) {}

class PartialLoginDto extends PartialType(PickType(RegisterDto, ['districtId'])){}

export class LoginDto extends IntersectionType(
    PickLoginDto,
    PartialLoginDto
){}