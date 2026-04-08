import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parking } from '../../entities/parking.entity';
import { Property } from '../../entities/property.entity';
import { Lodge } from '../../entities/lodge.entity';
import { Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Location } from '../../apps/eland-location/entities/location.entity';
import { ElandLocationService } from '../../apps/eland-location/eland-location.service';
; 
const logger = new Logger();

@Injectable()
export class ParkingService {

    constructor(
        private readonly locationService: ElandLocationService,
        @InjectRepository(Parking) private readonly parkingRepo: Repository<Parking>,
        @InjectRepository(Property) private readonly propertyRepo: Repository<Property>,
        @InjectRepository(Lodge) private readonly lodgeRepo: Repository<Lodge>,
        @InjectRepository(Location) private readonly locationRepo: Repository<Location>
    ){}

    /**
     * Add a new parking to a property
     */
        async addNewParking(parkingData: any) {
            console.log("Received parking data:", parkingData);
            const { propertyId, lodgeId, locationId, location, ...rest } = parkingData;

            if (!propertyId) {
                logger.error("Cannot identify the property this parking belongs to");
                throw new RpcException("Property ID is required");
            }

            try {
                // 1. Handle Location Logic
                let finalLocationId = locationId;

                // If locationId is missing but location object exists, create it
                if (!finalLocationId && location) {
                    // Map your incoming JSON fields to the LocationDto structure expected by createLocation
                    const locationDto = {
                        street_no: location.street_number,
                        street_name: location.street_name,
                        city: location.city,
                        province: location.state, // Mapping state to province
                        zipcode: location.zip_code,
                        country: location.country || 'CA', // Defaulting if not in your snippet
                        property_type: 'residential', // Default or derived
                    };

                    const newLocation = await this.locationService.createLocation(locationDto as any);
                    finalLocationId = newLocation.id;
                }

                
                // 2. Verify property exists
                const property = await this.propertyRepo.findOne({ where: { id: propertyId } });
                if (!property) {
                    throw new RpcException(`Property with ID ${propertyId} not found`);
                }

                // 3. Verify lodge exists if provided
                let lodge = null;
                if (lodgeId) {
                    lodge = await this.lodgeRepo.findOne({ where: { id: lodgeId } });
                    if (!lodge) {
                        throw new RpcException(`Lodge with ID ${lodgeId} not found`);
                    }
                }

                // 4. Create a new parking with relationships
                const newParking = this.parkingRepo.create({
                    ...rest,
                    charge: parkingData.chargePerHour || 0, // Mapping chargePerHour to charge column
                    property,
                    lodge,
                    locationId: finalLocationId // Assigning the resolved location ID
                });

                const savedParking = await this.parkingRepo.save(newParking);

                return {
                    status: 201,
                    message: "Parking added successfully",
                    data: savedParking
                };

            } catch (e) {
                logger.error(`Failed to add parking: ${e.message}`);
                return { status: 400, errors: e?.message, data: {} };
            }
        }

    /**
     * Update an existing parking
     * @param parkingId 
     * @param parkingData 
     * @returns 
     */
    async updateParking(parkingId: string, parkingData: Partial<Parking>) {
        if (!parkingId) {
            logger.error("Cannot identify this parking. Missing the parking id");
            throw new RpcException("Parking ID is required");
        }

        const parking = await this.parkingRepo.preload({
            id: parkingId,
            ...parkingData
        });

        if (!parking) {
            throw new RpcException(`Parking with ID ${parkingId} not found`);
        }

        const updatedParking = await this.parkingRepo.save(parking);

        return { status: 200, message: "Parking updated successfully!", data: updatedParking };
    }

    /**
     * Remove a parking from a property
     * @param parkingId 
     * @returns 
     */
    async removeParking(parkingId: string) {
        const parking = await this.parkingRepo.findOne({ where: { id: parkingId } });
        
        if (!parking) {
            throw new RpcException("Parking not found");
        }

        await this.parkingRepo.delete(parkingId);

        return { status: 200, message: "Parking removed successfully" };
    }

    /**
     * Find all parkings for a property
     * @param propertyId 
     * @returns 
     */
    async findAllParkings(propertyId: string) {
        if (!propertyId) {
            logger.error("Cannot identify the property this parking is attached to");
            throw new RpcException("Property ID is required");
        }

        const foundParkings = await this.parkingRepo.find({
            where: { property: { id: propertyId } },
            relations: ['property']
        });

        return { status: 200, data: foundParkings };
    }

    /**
     * Find a specific parking by ID
     * @param parkingId 
     * @returns 
     */
    async findParking(parkingId: string) {
        if (!parkingId) {
            logger.error("Cannot identify this parking. Missing parking id");
            throw new RpcException("Parking ID is required");
        }

        const foundParking = await this.parkingRepo.findOne({
            where: { id: parkingId },
            relations: ['property', 'lodge']
        });

        return { status: 200, data: foundParking };
    }

    /**
     * Find all parkings for a lodge
     * @param lodgeId 
     * @returns 
     */
    async findLodgeParkings(lodgeId: string) {
        if (!lodgeId) {
            logger.error("Cannot identify the Lodge this parking belongs to");
            throw new RpcException("Lodge ID is required");
        }

        const foundParkings = await this.parkingRepo.find({
            where: { lodge: { id: lodgeId } },
            relations: ['lodge']
        });

        return { status: 200, data: foundParkings };
    }
}
