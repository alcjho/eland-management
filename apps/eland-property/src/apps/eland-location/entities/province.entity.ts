import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Country } from './country.entity';
import { City } from './city.entity';
import { Location } from './location.entity';

@Entity('provinces')
export class Province {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb', { nullable: false })
  name: { fr: string; en: string };

  @Column({ nullable: false, type: 'varchar' })
  code: string;

  @Column('uuid', { nullable: false })
  countryId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Country, (country) => country.provinces, { eager: false })
  @JoinColumn({ name: 'countryId' })
  country: Country;

  @OneToMany(() => City, (city) => city.province)
  cities: City[];

  @OneToMany(() => Location, (location) => location.province)
  locations: Location[];
}
