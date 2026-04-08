import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('managers')
export class Manager {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: false })
  ownerId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'managerUserId' })
  user: User;
  
  @Column('uuid', { nullable: false, unique: true })
  managerUserId: string;

  @Column('uuid', { nullable: true })
  locationId: string;

  @Column({ type: 'varchar', nullable: false })
  fullname: string;

  @Column({ type: 'varchar', enum: ['M', 'F', 'O'], nullable: false })
  gender: string;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  workingStatus: string;

  @Column({ type: 'date', nullable: false })
  startDate: Date;

  @Column({ type: 'varchar', nullable: false })
  refPhone: string;

  @Column('text', { array: true, nullable: true })
  assignedProperties: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
