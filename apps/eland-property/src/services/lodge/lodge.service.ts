import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lodge } from '../../entities/lodge.entity';
import { Property } from '../../entities/property.entity';
import { Album } from '../../entities/album.entity';
import { LodgeDto } from '../../dto/lodge.dto';
import { LodgeResponseDto } from '../../dto/loge-response.dto';
import { RpcException } from '@nestjs/microservices';
import { ElandLocationService } from '../../apps/eland-location/eland-location.service';

@Injectable()
export class LodgeService {
    constructor(
        private readonly locationService: ElandLocationService,
        @InjectRepository(Lodge) private readonly lodgeRepo: Repository<Lodge>,
        @InjectRepository(Property) private readonly propertyRepo: Repository<Property>,
        @InjectRepository(Album) private readonly albumRepo: Repository<Album>,
        private readonly logger: Logger
    ) {}

    /**
     * Find all lodges for a property with pagination
     * @param propertyId 
     * @param offset 
     * @param limit 
     * @returns 
     */
    async findAllLodges(propertyId: string, offset: number = 0, limit: number = 20): Promise<LodgeResponseDto> {   
        if (!propertyId) {
            this.logger.error("Cannot find lodges for this property. Missing the property id?");
            throw new RpcException("Property ID is required");
        }

        try {
            const [foundLodges, totalLodges] = await this.lodgeRepo.findAndCount({
                where: { property: { id: propertyId } },
                relations: ['property'],
                skip: offset,
                take: limit
            });

            if (totalLodges === 0) {
                return { 
                    status: 200, 
                    data: [],
                    message: "No lodges found for this property" 
                };
            } else if (offset >= totalLodges) {
                return { 
                    status: 200, 
                    data: [],
                    message: "No more lodges found for this property" 
                };
            }

            return { 
                status: 200, 
                data: foundLodges, 
                message: "Lodges fetched successfully" 
            };
        } catch (e) {
            return { status: 400, message: e?.message, data: {} };
        }
    }

    /**
     * Find a lodge by ID
     * @param id 
     * @returns 
     */
    async findLodgeById(id: string): Promise<LodgeResponseDto> {
        if (!id) {
            this.logger.error("Cannot identify this lodge. Missing the lodge id");
            throw new RpcException("Lodge ID is required");
        }

        try {
            const foundLodge = await this.lodgeRepo.findOne({
                where: { id },
                relations: ['property']
            });

            if (!foundLodge) {    
                return { 
                    status: 404, 
                    message: "Lodge not found", 
                    data: {} 
                };
            }

            return { 
                status: 200, 
                data: foundLodge, 
                message: "Lodge fetched successfully" 
            };
        } catch (e) {
            return { status: 400, message: e?.message, data: {} };
        }
    }

    /**
     * Find album for a lodge
     * @param lodgeId 
     * @returns 
     */
    async findLodgeAlbum(lodgeId: string): Promise<LodgeResponseDto> {
        if (!lodgeId) {
            this.logger.error("Cannot identify this lodge. Missing the lodge id");
            throw new RpcException("Lodge ID is required");
        }

        try {
            const lodgeAlbum = await this.albumRepo.findOne({ 
                where: { lodge: { id: lodgeId } },
                relations: ['lodge']
            });

            return { 
                status: 200, 
                data: lodgeAlbum, 
                message: "Lodge album fetched successfully" 
            };
        } catch (e) {
            return { status: 400, message: e?.message, data: {} };
        }
    }

    async addNewLodge(lodgeData: any): Promise<any> {
        const { propertyId, locationId, location, ...rest } = lodgeData;

        if (!propertyId) {
            this.logger.error("Cannot identify the property this lodge belongs to");
            throw new RpcException("Property ID is required");
        }

        try {
            // 1. Verify property exists
            const property = await this.propertyRepo.findOne({ where: { id: propertyId } });
            if (!property) {
                throw new RpcException(`Property with ID ${propertyId} not found`);
            }

            // 2. Handle Location Logic (Deduplication)
            let finalLocationId = locationId;

            if (!finalLocationId && location) {
                // Check if this exact address already exists to avoid duplicates
                const locationDto = {
                    street_no: location.street_number,
                    street_name: location.street_name,
                    city: location.city,
                    province: location.state,
                    zipcode: location.zip_code,
                    country: location.country || 'CA',
                    property_type: 'residential', 
                };

                // Assuming your locationService.createLocation handles the 'Find or Create' logic 
                // internally. If it doesn't, you can call a find method first.
                const existingOrNewLocation = await this.locationService.createLocation(locationDto as any);
                finalLocationId = existingOrNewLocation.id;
            }

            // 3. Create and save the new lodge
            const newLodge = this.lodgeRepo.create({
                ...rest,
                property,
                locationId: finalLocationId, // Links the lodge to the location
            });

            const savedLodge = await this.lodgeRepo.save(newLodge);

            return { 
                status: 201, 
                message: "Lodge added successfully", 
                data: savedLodge
            };
        } catch (e) {
            this.logger.error(`Failed to add lodge: ${e.message}`);
            return { status: 400, message: e?.message, data: {} };
        }
    }

    /**
     * Update a lodge
     * @param id 
     * @param data 
     * @returns 
     */
    async updateLodge(id: string, data: Partial<LodgeDto>): Promise<LodgeResponseDto> {
        if (!id) {
            this.logger.error("Cannot identify this lodge. Missing the lodge id");
            throw new RpcException("Lodge ID is required");
        }

        try {
            const lodge = await this.lodgeRepo.preload({
                id,
                ...data
            });

            if (!lodge) {
                throw new RpcException(`Lodge with ID ${id} not found`);
            }

            const updatedLodge = await this.lodgeRepo.save(lodge);

            return { status: 200, message: "Lodge updated successfully!", data: updatedLodge };
        } catch (e) {
            return { status: 400, message: e?.message, data: {} };
        }
    }

    /**
     * Remove a lodge
     * @param id 
     * @returns 
     */
    async removeLodge(id: string): Promise<LodgeResponseDto> {
        try {
            const lodge = await this.lodgeRepo.findOne({ where: { id } });

            if (!lodge) {
                throw new RpcException("Lodge not found");
            }

            await this.lodgeRepo.delete(id);

            return { status: 200, message: "Lodge removed successfully", data: {} };
        } catch (e) {
            return { status: 400, message: e?.message, data: {} };
        }
    }
}
