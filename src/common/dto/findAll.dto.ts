import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class FindAllDto {
    @IsNumber({
        allowNaN:false
    })
    @IsOptional()
    @ApiProperty({
        default: 0
    })
    @Transform(value => Number(value))
    skip?: number;

    @IsNumber({
        allowNaN:false
    })
    @IsOptional()
    @ApiProperty({
        default: 10
    })
    @Transform(value => Number(value))
    limit?: number;
}