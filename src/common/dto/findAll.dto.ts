import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class FindAllDto {
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    @Transform(value => value ? Number(value) : undefined)
    skip?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    @Transform(value => value ? Number(value) : undefined)
    limit?: number;
}