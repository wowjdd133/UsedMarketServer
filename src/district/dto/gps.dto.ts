import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";

export class GpsDto {
    @ApiProperty()
    @IsNumber({
        allowNaN:false
    })
    @Transform(value => Number(value))
    lat: number;

    @ApiProperty()
    @IsNumber({
        allowNaN:false
    })
    @Transform(value => Number(value))
    lng: number;
}