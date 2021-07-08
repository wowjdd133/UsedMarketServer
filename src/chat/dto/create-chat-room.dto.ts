import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class CreateChatRoomDto {
    @ApiProperty()
    @IsInt()
    productId: number;
}