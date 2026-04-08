// src/property/entities/possession.entity.ts
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Property } from './property.entity';
import { Lodge } from './lodge.entity';
import { LeaseLabel } from '../types/leaseLabel.type';

@Entity('possessions')
export class Possession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => Property, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @ManyToOne(() => Lodge, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'lodge_id' })
  lodge: Lodge;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ['Furniture', 'Appliance', 'Electronics', 'other'] })
  category: string;

  @Column({ type: 'enum', enum: ['new', 'good', 'to be repaired'], default: 'good' })
  condition: string;

  @Column({ type: 'float', nullable: true })
  value: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  isAssigned: boolean;

  @Column({ type: 'boolean', default: false })
  isMainAsset: boolean;

  @Column({ type: 'enum', enum: LeaseLabel, default: LeaseLabel.POSSESSION })
  leaseLabel: string;
  
  @CreateDateColumn()
  createdAt: Date; 

  @UpdateDateColumn()
  updatedAt: Date;
}