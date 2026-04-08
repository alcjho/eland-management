import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Province } from './province.entity';
import { Location } from './location.entity';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb', { nullable: false })
  name: { fr: string; en: string };

  @Column({ nullable: true, type: 'varchar' })
  code: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Province, (province) => province.country)
  provinces: Province[];

  @OneToMany(() => Location, (location) => location.country)
  locations: Location[];
}
