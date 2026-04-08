// property.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Lodge } from './lodge.entity';
import { Amenity } from './amenity.entity';
import { Possession } from './possession.entity';
import { Parking } from './parking.entity';
import { LeaseLabel } from '../types/leaseLabel.type';
import { Location } from '../apps/eland-location/entities/location.entity';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => Location, { nullable: false, eager: false })
  @JoinColumn({ name: 'locationId' })
  location: Location;

  @Column({ type: 'uuid', nullable: false })
  locationId: string;

  @Column({ type: 'uuid', nullable: true })
  coverImageId: string;

  @Column({ type: 'text', nullable: true })
  image: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ['residential', 'commercial', 'industrial'] })
  type: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  totalUnits: number;

  @Column({ type: 'boolean', default: false })
  isSold: boolean;

  @Column({ type: 'enum', enum: ['Vacant', 'Ready', 'Occupied', 'Maintenance'] })
  status: string;

  @Column({ type: 'boolean', default: false })
  isMainAsset: boolean;

  @Column({ type: 'enum', enum: LeaseLabel, default: LeaseLabel.PROPERTY })
  leaseLabel: string;

  @OneToMany(() => Lodge, (lodge) => lodge.property, { cascade: true })
  lodges: Lodge[];

  @OneToMany(() => Parking, (parking) => parking.property, { cascade: true })
  parkings: Parking[];

  @OneToMany(() => Amenity, (amenity) => amenity.property, { cascade: true })
  amenities: Amenity[];

  @OneToMany(() => Possession, (possession) => possession.property, { cascade: true })
  possessions: Possession[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}