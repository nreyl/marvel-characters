import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsInt, Min, Max, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { CharacterStatus } from '../entities/character.entities';

export class CreateCharacterDto {
    @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(100) real_name: string;
    @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(100) alias: string;
    @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(150) main_power: string;
    @ApiProperty() @IsInt() @IsNotEmpty() @Min(1) @Max(100) power_level: number;
    @ApiProperty() @IsEnum(CharacterStatus) @IsNotEmpty() status: CharacterStatus;
    @ApiProperty() @IsBoolean() @IsNotEmpty() is_villain: boolean;
    @ApiPropertyOptional() @IsInt() @IsOptional() team_id?: number;
}