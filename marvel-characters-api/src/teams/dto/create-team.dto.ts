export class CreateTeamDto {
  name: string;
  base?: string;
  founded_year?: number;
  active?: boolean;
  characterIds?: number[];
}