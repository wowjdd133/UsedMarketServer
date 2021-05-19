import { Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class FindAllDto {
    @IsNumber()
    @IsOptional()
    @Transform(value => value ? Number(value) : undefined)
    skip?: number;

    @IsNumber()
    @IsOptional()
    @Transform(value => value ? Number(value) : undefined)
    take?: number;
}