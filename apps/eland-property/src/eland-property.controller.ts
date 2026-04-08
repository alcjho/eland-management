import { Controller, Get, Post, Put, Delete, Logger, Param, Body, Query, Request, BadRequestException, UseGuards, ValidationPipe } from '@nestjs/common';
import { ElandPropertyService } from './eland-property.service';
import { ParkingService } from './services/parking/parking.service';
import { LodgeService } from './services/lodge/lodge.service';
import { Action } from './ability.factory';
import { CheckAbilities } from './decorators/check-abilities.decorator';
import { Property } from './entities/property.entity';
import { AbilitiesGuard } from './guards/abilities.guard';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller({
  path: '/',
  version: '2',
})
@UseGuards(JwtAuthGuard, AbilitiesGuard)
export class ElandPropertyController {
  constructor(
    private readonly elandPropertyService: ElandPropertyService,
    private readonly parkingService: ParkingService,
    private readonly lodgeService: LodgeService,
    private readonly logger: Logger,
  ) {}

  // ============ PROPERTY ENDPOINTS ============

  @Post('property')
  @CheckAbilities({ action: Action.Create, subject: Property })
  async addProperty(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) data: any) {
    return this.elandPropertyService.addNewProperty(data);
  }

  @Put('property/:id')
  @CheckAbilities({ action: Action.Update, subject: Property })
  async updateProperty(@Param('id') id: string, @Body() data: any) {
    if (!id) {
      throw new BadRequestException('Property ID is required');
    }
    return this.elandPropertyService.updateProperty(id, data);
  }

  @Delete('property/:id')
  @CheckAbilities({ action: Action.Delete, subject: Property })
  async removeProperty(@Param('id') propertyId: string) {
    if (!propertyId) {
      throw new BadRequestException('Property ID is required');
    }
    return this.elandPropertyService.removeProperty(propertyId);
  }

  @Get('properties')
  @CheckAbilities({ action: Action.Read, subject: Property })
  async listProperties(@Request() req: any) {
    const userId = req.user?.ownerId;
    return this.elandPropertyService.listMyProperties(userId);
  }

  @Get('property/recent/:limit')
  @CheckAbilities({ action: Action.Read, subject: Property })
  async getRecentProperties(@Request() req: any, @Param('limit') limit?: number) {
    const userId = req.user?.ownerId;
    return this.elandPropertyService.getMostRecentProperties(userId, limit);
  }

  @Put('property/:propertyId/:locationId')
  async attachLocationToProperty(
    @Param('propertyId') propertyId: string,
    @Param('locationId') locationId: string
  ) {
    if (!propertyId || !locationId) {
      throw new BadRequestException('Property ID and Location ID are required');
    }
    return this.elandPropertyService.attachLocationToProperty(propertyId, locationId);
  }

  @Get('property/:id')
  async getProperty(@Param('id') propertyId: string) {
    if (!propertyId) {
      throw new BadRequestException('Property ID is required');
    }
    return this.elandPropertyService.getProperty(propertyId);
  }


  // ============ LODGE ENDPOINTS ============
  @Post('property/lodges')
  async addPropertyLodge(@Query('propertyId') propertyId: string, @Body() data: any) {
    return this.lodgeService.addNewLodge({ ...data, propertyId });
  }

  // ============ PARKING ENDPOINTS ============
  @Post('property/parkings')
  async addParking(
    @Query('propertyId') propertyId: string,
    @Query('lodgeId') lodgeId: string,
    @Body() data: any) {
    return this.parkingService.addNewParking({ ...data, propertyId, lodgeId });
  }

  @Put('property/:propertyId/lodge/:lodgeId')
  async updateLodgeProperty(
    @Param('propertyId') propertyId: string,
    @Param('lodgeId') lodgeId: string,
    @Body() data: any
  ) {
    return this.lodgeService.updateLodge(lodgeId, data);
  }

  @Delete('property:propertyId/lodge/:lodgeId')
  async removeLodgeProperty(
    @Param('propertyId') propertyId: string,
    @Param('lodgeId') lodgeId: string
  ) {
    if (!lodgeId) {
      throw new BadRequestException('Lodge ID is required');
    }
    return this.lodgeService.removeLodge(lodgeId);
  }

  @Get('property:propertyId/lodge/:lodgeId')
  async getLodge(
    @Param('propertyId') propertyId: string,
    @Param('lodgeId') lodgeId: string
  ) {
    if (!lodgeId) {
      throw new BadRequestException('Lodge ID is required');
    }
    return this.lodgeService.findLodgeById(lodgeId);
  }

  @Get('property/:propertyId/lodges')
  async getPropertyLodges(@Param('propertyId') propertyId: string) {
    if (!propertyId) {
      throw new BadRequestException('Property ID is required');
    }
    return this.lodgeService.findAllLodges(propertyId);
  }

  @Put('property/:propertyId/parking/:parkingId')
  async updatePropertyParking(
    @Param('propertyId') propertyId: string,
    @Param('parkingId') parkingId: string,
    @Body() data: any
  ) {
    return this.parkingService.updateParking(parkingId, data);
  }

  @Delete(':propertyId/parking/:parkingId')
  async removePropertyParking(
    @Param('propertyId') propertyId: string,
    @Param('parkingId') parkingId: string
  ) {
    if (!parkingId) {
      throw new BadRequestException('Parking ID is required');
    }
    return this.parkingService.removeParking(parkingId);
  }

  @Get('property/:propertyId/parking/:parkingId')
  async getParking(
    @Param('propertyId') propertyId: string,
    @Param('parkingId') parkingId: string
  ) {
    if (!parkingId) {
      throw new BadRequestException('Parking ID is required');
    }
    return this.parkingService.findParking(parkingId);
  }

  @Get('property/:propertyId/parkings')
  async getAllParking(@Param('propertyId') propertyId: string) {
    if (!propertyId) {
      throw new BadRequestException('Property ID is required');
    }
    return this.parkingService.findAllParkings(propertyId);
  }

  @Get('property/:propertyId/lodge/:lodgeId/parkings')
  async getLodgeParking(
    @Param('propertyId') propertyId: string,
    @Param('lodgeId') lodgeId: string
  ) {
    if (!lodgeId) {
      throw new BadRequestException('Lodge ID is required');
    }
    return this.parkingService.findLodgeParkings(lodgeId);
  }
}
