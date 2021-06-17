import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { FindAllDto } from "./findAll.dto";

export class SearchAllDto extends FindAllDto {
    @IsString()
    @ApiProperty()
    text: string;
}