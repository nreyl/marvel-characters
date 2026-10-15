import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @Column(limit => limit(1, 100))
    power_level: number;

    @Column( { type: 'enum', enum: CharacterStatus, default: CharacterStatus.ACTIVE } )
    status: CharacterStatus;

    @Column ({type :"boolean", default: false})
    is_villain: boolean;

    @Column({nullable: true})
    team_id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}


