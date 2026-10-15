import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Character } from './entities/character.entities';
import { Repository } from 'typeorm/browser/repository/Repository.js';

@Injectable()
export class CharactersService {
    constructor(
        @InjectRepository(Character) private characterRepository: Repository<Character>
    ) {}

    //obtener todos los personajes
    async findAll(){
        return await this.characterRepository.find();
    }


}
