import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class ChangeUserProfileDto {
    @ApiProperty()
    @IsString()
    @Length(2,20)
    name: string;
}