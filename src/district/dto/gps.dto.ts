import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";

export class GpsDto {
    @ApiProperty()
    @IsNumber()
    @Transform(value => Number(value))
    lat: number;

    @ApiProperty()
    @IsNumber()
    @Transform(value => Number(value))
    lng: number;
}