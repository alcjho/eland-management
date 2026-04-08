import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

// Entities (Reflecting your SQL Migration)
import { Property } from './entities/property.entity';
import { Lodge } from './entities/lodge.entity';
import { Parking } from './entities/parking.entity';
import { Amenity } from './entities/amenity.entity';
import { Possession } from './entities/possession.entity';
import { Bedroom } from './entities/bedroom.entity';
import { Room } from './entities/room.entity';

// DTOs
import { PropertyDto } from './dto/property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { ElandLocationService } from './apps/eland-location/eland-location.service';

@Injectable()
export class ElandPropertyService {
  private readonly logger = new Logger(ElandPropertyService.name);

  constructor(
    @InjectRepository(Property) private propertyRepo: Repository<Property>,
    @InjectRepository(Lodge) private lodgeRepo: Repository<Lodge>,
    @InjectRepository(Parking) private parkingRepo: Repository<Parking>,
    @InjectRepository(Amenity) private amenityRepo: Repository<Amenity>,
    @InjectRepository(Possession) private possessionRepo: Repository<Possession>,
    @InjectRepository(Bedroom) private bedroomRepo: Repository<Bedroom>,
    @InjectRepository(Room) private roomRepo: Repository<Room>,
    private readonly locationService: ElandLocationService, // Inject location service
  ) {}

  /**
   * Adds a new property. In SQL, enums are handled at the DB level.
   */
  async addNewProperty(propertyData: PropertyDto) {
    // destructure early so we can ignore invalid ids
    const { id, location, locationId, ...rest } = propertyData as any;
    
    // add location if provided
    if(location && !locationId) {
      location.id = uuidv4(); // Ensure location has an ID
      const result = await this.locationService.createLocation(location);
      if(result?.id) {
        rest.locationId = result.id;
      }else{
        throw new BadRequestException('Failed to create location for this property');
      }
    }

    if(!rest.locationId) {
      throw new BadRequestException('Location ID is required to create a property');
    }
    
    const newProperty = (this.propertyRepo.create({
      id: uuidv4(),
      ...rest
    }) as unknown) as Property;

    const savedProperty = await this.propertyRepo.save(newProperty);
    if(!savedProperty) {
      this.logger.debug(`Failed to create new property`);
      // remove location if it was created but property save failed to avoid orphaned location
      if(rest.locationId) {
        await this.locationService.removeLocation(rest.locationId);
      }
      throw new BadRequestException('Failed to create property');
    }
    
    return { status: 201, data: savedProperty };
  }

  
  /**
   * Updates property using TypeORM's preload for partial updates.
   */
  async updateProperty(id: string, data: UpdatePropertyDto) {
    const { location, locationId, ...rest } = data as any;
    let updatedLocationId = locationId;

    if (location) {
      if (!updatedLocationId) {
        const existingProperty = await this.propertyRepo.findOne({
          where: { id },
          select: ['locationId'],
        });
        updatedLocationId = existingProperty?.locationId;
      }

      console.log('Updating location for property ID:', id, 'Location Data:', location, 'Existing Location ID:', updatedLocationId);  
      if (updatedLocationId) {
        await this.locationService.updateLocation(updatedLocationId, location);
      } else {
        const createdLocation = await this.locationService.createLocation(location);
        if (!createdLocation?.id) {
          throw new BadRequestException('Failed to create location for this property');
        }
        updatedLocationId = createdLocation.id;
      }
    }

    if (updatedLocationId) {
      rest.locationId = updatedLocationId;
    }

    const property = await this.propertyRepo.preload({
      id,
      ...rest,
    });

    if (!property) {
      throw new BadRequestException(`Oops! cannot find this property : ${id}`);
    }

    const updated = await this.propertyRepo.save(property);
    return { status: 200, data: updated };
  }

  async removeProperty(propertyId: string) {
  // 1. Fetch with relations to capture the state before deletion
  const property = await this.propertyRepo.findOne({ 
      where: { id: propertyId },
      relations: ['lodges'] 
  });

  if (!property) {
    throw new NotFoundException(`Property with ID ${propertyId} not found`);
  }

  const impactedCount = property.lodges?.length ?? 0;

  // 2. Perform the deletion
  // Using .delete() is faster than .remove() as it doesn't trigger entity hooks
  await this.propertyRepo.delete(propertyId);

  return {
    propertyDeleted: 1,
    lodgesImpacted: impactedCount,
    status: 'Success'
  };
}

  /**
   * Retrieves all properties for a user, including their associated lodges.
   */
  async listMyProperties(userId: string) {
    const properties = await this.propertyRepo.find({
      where: { userId },
      relations: ['lodges', 'location'] // Replaces Mongoose manual .map()
    });
      
    return { status: 200, data: properties };
  }

  /**
   * Gets a specific property with all its child assets.
   */
  async getProperty(id: string) {
    const propertyQuery = this.propertyRepo
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.location', 'location')
      .leftJoinAndSelect('property.lodges', 'lodges')
      .leftJoinAndSelect('property.amenities', 'amenities')
      .leftJoinAndSelect('property.possessions', 'possessions')
      .leftJoinAndSelect('property.parkings', 'parkings')
      .where('property.id = :id', { id })
      .orderBy('parkings.createdAt', 'DESC');

    const property = await propertyQuery.getOne();

    if (!property) throw new BadRequestException('Property not found');

    return { status: 200, data: property };
  }

  async getMostRecentProperties(userId: string, limit = 5) {
    const properties = await this.propertyRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['lodges']
    }); 
    return { status: 200, data: properties };
  }

  /**
   * Attach a new location to a property
   */
  async attachLocationToProperty(propertyId: string, locationId: string) {
    // Validate property exists
    const property = await this.propertyRepo.findOne({ where: { id: propertyId } });
    if (!property) {
      throw new BadRequestException('Property not found');
    }

    // Validate location exists using location service
    const location = await this.locationService.getLocation(locationId);
    if (!location) {
      throw new BadRequestException('Location not found');
    }

    // Update property with new location
    property.locationId = locationId;
    const updated = await this.propertyRepo.save(property);

    return { 
      status: 200, 
      message: 'Location attached to property successfully',
      data: updated 
    };
  }
}