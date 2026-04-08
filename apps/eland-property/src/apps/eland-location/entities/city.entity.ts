import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Province } from './province.entity';
import { Location } from './location.entity';

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb', { nullable: false })
  name: { fr: string; en: string };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Province, (province) => province.cities, { eager: false })
  @JoinColumn({ name: 'provinceId' })
  province: Province;

  @OneToMany(() => Location, (location) => location.city)
  locations: Location[];
}
