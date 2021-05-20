import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class FindAllDto {
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    @Transform(value => Number(value))
    skip?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    @Transform(value => Number(value))
    limit?: number;
}