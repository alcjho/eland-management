import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Lodge } from './lodge.entity';
import { AssetType } from '../types/asset-type.type';

export enum AlbumCategory {
  INTERIOR = 'interior',
  EXTERIOR = 'exterior',
  FLOOR_PLAN = 'floor plan',
  OTHER = 'other'
}

@Entity('albums')
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => Lodge, (lodge) => lodge.albums, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lodgeId' })
  lodge: Lodge;

  @Column('text', { array: true, default: [] })
  fileIds: string[];

  @Column()
  album_name: string;

  @Column({
    type: 'enum',
    enum: AlbumCategory,
    default: AlbumCategory.OTHER
  })
  album_category: AlbumCategory;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: 'Property', enum: AssetType })
  asset: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}