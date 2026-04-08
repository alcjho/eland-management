// src/property/entities/parking.entity.ts
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Property } from './property.entity';
import { Lodge } from './lodge.entity';
import { LeaseLabel } from '../types/leaseLabel.type';
import { Location } from '../apps/eland-location/entities/location.entity';

export enum ParkingStatus {
    RESERVED = 'reserved',
    OCCUPIED = 'occupied',
    AVAILABLE = 'available'
}

export enum VehicleType {
    CAR = 'car',
    MOTORCYCLE = 'motorcycle',
    TRUCK = 'truck',
    ANY = 'any',
    OTHER = 'other'
}

export enum ChargeFrequencies {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    HOURLY = 'hourly',
    MONTHLY = 'monthly'
}

@Entity('parkings')
export class Parking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => Property, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'propertyId' })
    property: Property;

    @ManyToOne(() => Location, { nullable: true, eager: false })
    @JoinColumn({ name: 'locationId' })
    location: Location;

    @Column({ type: 'uuid', nullable: true })
    locationId: string;

    @ManyToOne(() => Lodge, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'lodgeId' })
    lodge: Lodge;

    @Column()
    slotNumber: string;

    @Column({ type: 'enum', enum: ParkingStatus, default: ParkingStatus.AVAILABLE })
    status: string;

    @Column({ type: 'enum', enum: VehicleType, default: VehicleType.ANY })
    vehicleType: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    charge: number;

    @Column({ type: 'enum', enum: ChargeFrequencies, default: ChargeFrequencies.HOURLY })
    chargeFrequency: string;

    @Column({ type: 'boolean', default: false })
    isAssigned: boolean;

    @Column({ type: 'boolean', default: false })
    isMainAsset: boolean;

    @Column({ type: 'enum', enum: LeaseLabel, default: LeaseLabel.PARKING })
    leaseLabel: string;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
}