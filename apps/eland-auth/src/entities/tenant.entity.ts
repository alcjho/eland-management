import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantUserId' })
  user: User;

  @Column('uuid', { nullable: false, unique: true })
  tenantUserId: string;

  @Column('uuid', { nullable: true })
  locationId: string;

  @Column({ type: 'varchar', nullable: false })
  fullname: string;

  @Column({ type: 'varchar', enum: ['M', 'F', 'O'], nullable: false })
  gender: string;

  @Column({ type: 'varchar', enum: ['Mr.', 'Mrs', 'Other'], nullable: true })
  title: string;

  @Column({
    type: 'varchar',
    enum: ['Married', 'Divorced', 'Separated', 'Partner'],
    nullable: true,
  })
  maritalStatus: string;

  @Column({ type: 'varchar', nullable: true })
  partnerName: string;

  @Column({ type: 'boolean', nullable: true })
  haveKids: boolean;

  @Column({ type: 'integer', nullable: true })
  numberOfKids: number;

  @Column({ type: 'varchar', nullable: false })
  occupation: string;

  @Column({ type: 'varchar', nullable: true })
  workingStatus: string;

  @Column({ type: 'varchar', nullable: true })
  income: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string;

  @Column({ type: 'varchar', nullable: true })
  emergencyContact: string;

  @Column('text', { array: true, nullable: true })
  documents: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
