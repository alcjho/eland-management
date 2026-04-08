import { BadRequestException, Controller, Get, Post, Put, Param, Body, Query } from '@nestjs/common';
import { ElandLocationService } from './eland-location.service';
import { LocationDto } from './dto/location.dto';
import { CityDto } from './dto/city.dto';


@Controller('location')
export class ElandLocationController {
  constructor(private readonly elandLocationService: ElandLocationService) {}

  @Post()
  async addLocation(@Body() data: LocationDto) {
    return this.elandLocationService.createLocation(data);
  }

  @Post('city')
  async addCity(@Body() data: CityDto) {
    return this.elandLocationService.addCity(data);
  }

  @Put(':id')
  async updateLocation(@Param('id') id: string, @Body() data: LocationDto) {
    if (!id) {
      throw new BadRequestException('Missing location ID in request');
    }
    return this.elandLocationService.updateLocation(id, data);
  }

  @Post('batch/:offset/:limit')
  async getLocationBatch(
    @Body() data: string[],
    @Param('offset') offset: number,
    @Param('limit') limit: number,
  ) {
    if (!data || data.length === 0) {
      throw new BadRequestException('Missing batch of location IDs');
    }
    return this.elandLocationService.getLocationBatch(data, offset, limit);
  }

  @Get('cities')
  async getCities(@Query('lang') lang?: string) {
    return this.elandLocationService.findAllCities(lang);
  }

  @Get('/provinces')
  async getProvinces() {
    return this.elandLocationService.findAllProvinces();
  }

  @Get('/countries')
  async getCountries() {
    return this.elandLocationService.findAllCountries();
  }

  @Get(':id')
  async getLocation(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Missing location ID param');
    }
    return this.elandLocationService.getLocation(id);
  }
}
