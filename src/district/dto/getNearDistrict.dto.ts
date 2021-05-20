import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";
import { FindAllDto } from "src/common/dto/findAll.dto";

export class GetNearDistrict extends FindAllDto {
    @ApiProperty()
    @IsNumber()
    @Transform(value => Number(value))
    lat: number;

    @ApiProperty()
    @IsNumber()
    @Transform(value => Number(value))
    lng: number;
}