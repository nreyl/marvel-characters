import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn,
  ManyToOne,
  JoinColumn 
} from 'typeorm';
import { Team } from '../../teams/entities/team.entity';
export enum CharacterStatus {
    ACTIVE = 'ACTIVE',
    INJURED = 'INJURED',
    MISSING = 'MISSING',
    RETIRED = 'RETIRED'
}

@Entity('characters')
export class Character {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    real_name: string;

    @Column({ unique: true })
    alias: string;

    @Column()
    main_power: string;

    @Column({ type: 'int' })
    power_level: number;

    @Column( { type: 'enum', enum: CharacterStatus, default: CharacterStatus.ACTIVE } )
    status: CharacterStatus;

    @Column ({type :"boolean", default: false})
    is_villain: boolean;

    @Column({nullable: true})
    team_id: number | null;

    @ManyToOne(() => Team, (team) => team.characters, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'team_id' })
    team: Team;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}


