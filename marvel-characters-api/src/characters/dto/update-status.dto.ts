import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { CharacterStatus } from '../entities/character.entities';

export class UpdateStatusDto {
    @ApiProperty({ enum: CharacterStatus }) @IsEnum (CharacterStatus) @IsNotEmpty() status: CharacterStatus;
}