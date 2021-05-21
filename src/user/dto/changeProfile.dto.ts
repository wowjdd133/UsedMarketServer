import { IsString, Length } from "class-validator";

export class ChangeUserProfileDto {
    @IsString()
    @Length(2,20)
    name: string;
}