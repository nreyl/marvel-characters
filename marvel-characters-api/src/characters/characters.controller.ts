import {
    Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Put, Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { FindCharactersQueryDto } from './dto/find-characters-query.dto';

@ApiTags('characters')
@Controller('characters')
export class CharactersController {
    constructor(private readonly charactersService: CharactersService) {}

    @Get()
    @ApiOperation({ summary: 'Lista los personajes, con filtros opcionales' })
    @ApiResponse({ status: 200, description: 'Lista de personajes' })
    @ApiResponse({ status: 400, description: 'Filtro inválido' })
    findAll(@Query() query: FindCharactersQueryDto) {
        return this.charactersService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtiene un personaje con los datos de su equipo' })
    @ApiResponse({ status: 200, description: 'Personaje encontrado' })
    @ApiResponse({ status: 404, description: 'El personaje no existe' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.charactersService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Crea un personaje' })
    @ApiResponse({ status: 201, description: 'Personaje creado' })
    @ApiResponse({ status: 400, description: 'Datos inválidos o equipo inactivo' })
    @ApiResponse({ status: 404, description: 'El equipo no existe' })
    @ApiResponse({ status: 409, description: 'El alias ya existe' })
    create(@Body() dto: CreateCharacterDto) {
        return this.charactersService.create(dto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Reemplaza el personaje completo' })
    @ApiResponse({ status: 200, description: 'Personaje actualizado' })
    @ApiResponse({ status: 400, description: 'Datos inválidos o equipo inactivo' })
    @ApiResponse({ status: 404, description: 'El personaje o el equipo no existe' })
    @ApiResponse({ status: 409, description: 'El alias ya existe' })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateCharacterDto) {
        return this.charactersService.update(id, dto);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Cambia únicamente el estado del personaje' })
    @ApiResponse({ status: 200, description: 'Estado actualizado' })
    @ApiResponse({ status: 400, description: 'Estado inválido o transición no permitida' })
    @ApiResponse({ status: 404, description: 'El personaje no existe' })
    updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStatusDto) {
        return this.charactersService.updateStatus(id, dto.status);
    }

    @Delete(':id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Elimina un personaje' })
    @ApiResponse({ status: 200, description: 'Personaje eliminado' })
    @ApiResponse({ status: 404, description: 'El personaje no existe' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.charactersService.remove(id);
    }
}
