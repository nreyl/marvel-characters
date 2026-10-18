import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Team } from './entities/team.entity';
import { Character } from '../characters/entities/character.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { AssignCharactersDto } from './dto/assign-characters.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {}

  findAll(): Promise<Team[]> {
    return this.teamRepository.find();
  }

  async findOne(id: number): Promise<Team> {
    const team = await this.teamRepository.findOne({ where: { id } });
    if (!team) {
      throw new NotFoundException(`Team con id ${id} no encontrado`);
    }
    return team;
  }

  async getCharacters(id: number): Promise<Character[]> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['characters'],
    });
    if (!team) {
      throw new NotFoundException(`Team con id ${id} no encontrado`);
    }
    return team.characters;
  }

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const { characterIds, ...teamData } = createTeamDto;
    const team = this.teamRepository.create(teamData);
    const savedTeam = await this.teamRepository.save(team);

    if (characterIds && characterIds.length > 0) {
      const characters = await this.characterRepository.findBy({ id: In(characterIds) });
      characters.forEach((char) => {
        char.team = savedTeam;
      });
      await this.characterRepository.save(characters);
    }

    return this.findOne(savedTeam.id);
  }

  async replace(id: number, createTeamDto: CreateTeamDto): Promise<Team> {
    const team = await this.findOne(id);
    const { characterIds, ...teamData } = createTeamDto;

    Object.assign(team, teamData);
    const updatedTeam = await this.teamRepository.save(team);

    if (characterIds !== undefined) {
      // Desvincular personajes actuales si es reemplazo completo
      await this.characterRepository.update({ team: { id } }, { team: null });

      if (characterIds.length > 0) {
        const characters = await this.characterRepository.findBy({ id: In(characterIds) });
        characters.forEach((char) => {
          char.team = updatedTeam;
        });
        await this.characterRepository.save(characters);
      }
    }

    return this.findOne(id);
  }

  async assignCharacters(id: number, dto: AssignCharactersDto): Promise<Team> {
    const team = await this.findOne(id);
    const characters = await this.characterRepository.findBy({ id: In(dto.characterIds) });

    characters.forEach((char) => {
      char.team = team;
    });

    await this.characterRepository.save(characters);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const team = await this.findOne(id);
    await this.teamRepository.remove(team);
  }
}