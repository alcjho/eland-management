// src/property/entities/room.entity.ts
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Lodge } from './lodge.entity';
import { LeaseLabel } from '../types/leaseLabel.type';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Lodge, (lodge) => lodge.rooms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lodge_id' })
  lodge: Lodge;

  @Column()
  size: string;

  @Column({ type: 'enum', enum: ['Living room', 'Dining room', 'Kitchen', 'Bathroom', 'Powder room', 'Wash room', 'Warehouse'] })
  type: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: false })
  isMainAsset: boolean;

  @Column({ type: 'enum', enum: LeaseLabel, nullable: false })
  leaseLabel: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}