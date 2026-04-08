import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { City } from './city.entity';
import { Province } from './province.entity';
import { Country } from './country.entity';

export enum PropertyType {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  INDUSTRIAL = 'industrial',
}

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PropertyType, nullable: false })
  propertyType: PropertyType;

  @Column({ nullable: true, type: 'varchar' })
  buildingName: string;

  @Column({ nullable: false, type: 'varchar' })
  streetNo: string;

  @Column({ nullable: false, type: 'varchar' })
  streetName: string;

  @Column({ nullable: true, type: 'varchar' })
  aptNo: string;

  @Column({ nullable: true, type: 'varchar' })
  suiteNo: string;

  @Column({ nullable: true, type: 'varchar' })
  lotNo: string;

  @Column({ nullable: true, type: 'varchar' })
  unitNo: string;

  @Column({ nullable: false, type: 'varchar' })
  zipcode: string;

  @Column({ nullable: true, type: 'varchar' })
  pobox: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => City, (city) => city.locations, { eager: true })
  @JoinColumn({ name: 'cityId' })
  city: City;

  @ManyToOne(() => Province, (province) => province.locations, { eager: true })
  @JoinColumn({ name: 'provinceId' })
  province: Province;

  @ManyToOne(() => Country, (country) => country.locations, { eager: true })
  @JoinColumn({ name: 'countryId' })
  country: Country;
}
