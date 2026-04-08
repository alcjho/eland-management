import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ProtectedDocument } from './protected-document.entity';

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

  // Generic link to Monolith assets (Lodge ID, Parking ID, etc)
  @Column({ nullable: false })
  resourceId: string;

  // Type of asset (e.g., 'lodge', 'parking', 'unit')
  @Column({ nullable: false })
  resourceType: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Explicit relationship: An album contains many documents (pictures)
  @OneToMany(() => ProtectedDocument, (doc) => doc.album, { cascade: true })
  documents: ProtectedDocument[];
}