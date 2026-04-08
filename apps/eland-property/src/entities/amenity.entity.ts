// amenity.entity.ts
import { Entity, Column, PrimaryColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Property } from './property.entity';
import { LeaseLabel } from '../types/leaseLabel.type';

@Entity('amenities')
export class Amenity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Property, (property) => property.amenities)
  property: Property;

  @Column()
  name: string;

  @Column({ type: 'simple-array', nullable: true })
  features: string[]; // Maps to your features: string[] in Mongo

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  extra_cost: number;

  @Column({ default: false })
  isPremium: boolean;

  @Column({ default: true   })
  isMainAsset: boolean;

  @Column({ type: 'enum', enum: LeaseLabel, default: LeaseLabel.AMENITY })
  leaseLabel: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}