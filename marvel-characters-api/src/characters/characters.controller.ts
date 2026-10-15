import { Controller, Get } from '@nestjs/common';
import { Character } from './entities/character.entities';
import { CharactersService } from './characters.service';

@Controller('characters')
export class CharactersController {
    constructor(private readonly charactersService: CharactersService) {}

    @Get()
    findAll(): Promise<Character[]> {
        return this.charactersService.findAll();
    }
}
