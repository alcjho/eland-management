import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('owners')
export class Owner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: false })
  mainOwnerId: string;

  @Column({ type: 'varchar', nullable: true })
  ownerIdToken: string;

  @Column({ type: 'boolean', default: false })
  isMainOwner: boolean;

  @Column('uuid', { nullable: false, unique: true })
  ownerUserId: string;

  @Column('uuid', { nullable: true })
  locationId: string;

  @Column({ type: 'varchar', nullable: false })
  fullname: string;

  @Column({ type: 'varchar', enum: ['M', 'F', 'O'], nullable: true })
  gender: string;

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 10 })
  sharePct: number;

  @Column('text', { array: true, nullable: true })
  onProperties: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
