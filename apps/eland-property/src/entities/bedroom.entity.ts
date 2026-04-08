// src/property/entities/bedroom.entity.ts
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Lodge } from './lodge.entity';
import { LeaseLabel } from '../types/leaseLabel.type';
import { Location } from '../apps/eland-location/entities/location.entity';
import { Property } from './property.entity';

@Entity('bedrooms')
export class Bedroom {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Generated via uuidv7() in service

  @Column()
  userId: string;

  @Column({ nullable: true })
  tenantUserId: string;

  @ManyToOne(() => Property, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @ManyToOne(() => Lodge, (lodge) => lodge.bedrooms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lodgeId' })
  lodge: Lodge;

  @ManyToOne(() => Location, { nullable: true, eager: false })
  @JoinColumn({ name: 'locationId' })
  location: Location;

  @Column({ type: 'uuid', nullable: true })
  locationId: string;

  @Column()
  size: string;

  @Column({ type: 'enum', enum: ['Master bedroom', 'Bedroom', 'Guest room'] })
  type: string;

  @Column()
  description: string;

  @Column({ default: true })
  isMainAsset: boolean;

  @Column({ type: 'enum', enum: LeaseLabel, default: LeaseLabel.BEDROOM })
  leaseLabel: string;

  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
}