import { ApiPropertyOptional } from '@nestjs/swagger';
import { CharacterStatus } from '../entities/character.entities';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class FindCharactersQueryDto {
    @ApiPropertyOptional({ enum: CharacterStatus }) @IsOptional() @IsEnum(CharacterStatus) status?: CharacterStatus;
    @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() teamId?: number;

}