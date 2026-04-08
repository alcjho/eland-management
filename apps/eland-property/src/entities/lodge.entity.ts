// lodge.entity.ts
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Property } from './property.entity';
import { Room } from './room.entity';
import { Bedroom } from './bedroom.entity';
import { Album } from './album.entity';
import { CurrencyType } from '../types/currency.type';
import { LeaseLabel } from '../types/leaseLabel.type';
import { Location } from '../apps/eland-location/entities/location.entity';
import { Parking } from './parking.entity';

export enum LeaseType {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  SHORT = 'short'
}

@Entity('lodges')
export class Lodge {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Property, (property) => property.lodges, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'propertyId' })
    property: Property;

    @Column({ type: 'uuid', nullable: true })
    propertyId: string;

    @ManyToOne(() => Location, { nullable: true, eager: false })
    @JoinColumn({ name: 'locationId' })
    location: Location;

    @Column({ type: 'uuid', nullable: true })
    locationId: string;

    @OneToMany(() => Bedroom, (bedroom) => bedroom.lodge)
    bedrooms: Bedroom[];

    @OneToMany(() => Room, (room) => room.lodge)
    rooms: Room[];

    @OneToMany(() => Parking, (parking) => parking.lodge)
    parkings: Parking[];

    @OneToMany(() => Album, (album) => album.lodge)
    albums: Album[];

    @Column()
    name: string; // e.g., "Flat A Unit 1"

    @Column()
    size: string;

    @Column({ name: 'lodgeNumber' })
    lodgeNumber: string;

    @Column({ name: 'floorNumber' })
    floorNumber: string;

    @Column({ name: 'currency', type: 'enum', enum: CurrencyType, default: CurrencyType.CAD })
    currency: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    price: number;

    @Column({ type: 'boolean', default: false })
    isMainAsset: boolean;

    @Column({ type: 'enum', enum: LeaseLabel, default: LeaseLabel.LODGE })
    leaseLabel: string;
      
    @Column({ type: 'enum', enum: LeaseType })
    leaseType: LeaseType;

    @Column({ default: 'available' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
}