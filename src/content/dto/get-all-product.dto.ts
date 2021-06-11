import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";
import { FindAllDto } from "src/common/dto/findAll.dto";


export class GetAllProductDto extends FindAllDto {
    @IsNumber({
        allowNaN: false
    })
    @ApiProperty({
        default: 1
    })
    @Transform(value => Number(value))
    districtId: number;
}