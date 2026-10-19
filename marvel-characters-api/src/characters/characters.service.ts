import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Character, CharacterStatus } from './entities/character.entities';
import { Repository } from 'typeorm';
import { Team } from '../teams/entities/team.entity';
import { FindCharactersQueryDto } from './dto/find-characters-query.dto';
import { CreateCharacterDto } from './dto/create-character.dto';

@Injectable()
export class CharactersService {
    constructor(
        @InjectRepository(Character) private characterRepository: Repository<Character>,
        @InjectRepository(Team) private teamRepository: Repository<Team>
    ) {}

    private async assertAliasFree(alias: string, excludeId?: number) {
        const found = await this.characterRepository.findOne({ where: { alias } });
        if (found && found.id !== excludeId) {
            throw new ConflictException('Ya existe un personaje con alias ' + alias);
        }
    }

    private async assertTeamUsable(teamId?: number | null) {
        if (teamId === null || teamId === undefined) return;
        const team = await this.teamRepository.findOne({ where: { id: teamId } });
        if (!team) { throw new NotFoundException('No existe un equipo con id ' + teamId); }
        if (!team.active) { throw new BadRequestException('El equipo con id ' + teamId + ' no está activo'); }
    }

    private async save(character: Character) {
        try {
            return await this.characterRepository.save(character);
        } catch (e: any){
            if ((e.code ?? e.driverError?.code) === '23505') throw new ConflictException('Alias duplicado');
            throw e;
        }
    }

    async findAll(query: FindCharactersQueryDto) {
        return this.characterRepository.find({
            where: {
                ...(query.status && { status: query.status }),
                ...(query.teamId !== undefined && { team_id: query.teamId }),
            },
        });
    }

    async findOne(id: number) {
        const character = await this.characterRepository.findOne({ 
            where: { id }, 
            relations: { team: true }
            });
        if (!character) throw new NotFoundException('Personaje ' + id + ' no existe');
        return character;

    }

    async create(dto: CreateCharacterDto) {
        await this.assertAliasFree(dto.alias);
        await this.assertTeamUsable(dto.team_id);
        const character = this.characterRepository.create({
            ...dto, team_id: dto.team_id ?? null
        });
        return this.save(character);
    }

    async update(id: number, dto: CreateCharacterDto) {
        await this.findOne(id);
        await this.assertAliasFree(dto.alias, id);
        await this.assertTeamUsable(dto.team_id);
        await this.characterRepository.update(id, { ...dto, team_id: dto.team_id ?? null });
        return this.findOne(id);
    }

    async updateStatus(id: number, status: CharacterStatus) {
        const character = await this.findOne(id);
        if (character.status === CharacterStatus.RETIRED && status === CharacterStatus.INJURED) {
            throw new BadRequestException('Un personaje no puede pasar directamente de retirado a lastimado');
        }
        await this.characterRepository.update(id, { status });
        return this.findOne(id);
    }

    async remove(id: number) {
        const character = await this.findOne(id);
        await this.characterRepository.remove(character);
        return { message: 'Personaje ' + id + ' eliminado' };
    }


}
    