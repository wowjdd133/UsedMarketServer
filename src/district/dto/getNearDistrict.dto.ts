import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
import { FindAllDto } from "src/common/dto/findAll.dto";

export class GetNearDistrict extends FindAllDto {
    @ApiProperty()
    @IsNumber()
    lat: number;

    @ApiProperty()
    @IsNumber()
    lng: number;
}