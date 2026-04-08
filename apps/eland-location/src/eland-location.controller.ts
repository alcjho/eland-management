import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { ElandLocationService } from './eland-location.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { from, Observable } from 'rxjs';
import { LocationDto } from './dtos/location.dto';
import { CityDto } from './dtos/city.dto';
import { GwResponse } from './interfaces/gw-response.interface';


@Controller()
export class ElandLocationController {
  constructor(private readonly elandLocationService: ElandLocationService) {}

  @MessagePattern({ cmd: 'location.create' })
  addLocation(@Payload() payload: GwResponse): Observable<any> {
    const data: LocationDto = payload.data;
    return from(this.elandLocationService.createLocation(data));
  }

  @MessagePattern({ cmd: 'city.create' })
  addCity(@Payload() payload: GwResponse): Observable<any> {
    const data: CityDto = payload.data;
    return from(this.elandLocationService.addCity(data));
  }

  @MessagePattern({ cmd: 'location.update' })
  updateLocation(@Payload() payload: GwResponse): Observable<any> {
    const data: LocationDto = payload.data;
    const { params } = payload;

    if (!params) {
      throw new RpcException("Missing location ID in request.");
    }
    const id = params.id
    return from(this.elandLocationService.updateLocation(id, data));
  }

  @MessagePattern({ cmd: 'location.get' })
  getLocation(@Payload() payload: GwResponse): Observable<any> {
    const { params } = payload;

    if(!params?.id){
      throw new RpcException("Missing location ID param.");
    }

    return from(this.elandLocationService.getLocation(params.id));
  }

  @MessagePattern({ cmd: 'location.batch.get' })
  getLocationBatch(@Payload() payload: GwResponse): Observable<any> {
    const { params, data } = payload;
    console.log(params, data)
    if(data?.length == 0){
      throw new RpcException("Missing batch of location IDs.");
    }
    
    return from(this.elandLocationService.getLocationBatch(data, params?.offset, params.limit));
  }

  @MessagePattern({ cmd: 'cities.get' })
  getCities(@Payload() payload: GwResponse): Observable<any> {
    const { params } = payload;
    const lang = params.lg
    return from(this.elandLocationService.findAllCities(lang));
  }

  @MessagePattern({ cmd: 'provinces.get' })
  getProvinces(@Payload() payload: GwResponse): Observable<any> {
    const { params } = payload;
    const lang = params.lg
    return from(this.elandLocationService.findAllProvinces());
  }

  @MessagePattern({ cmd: 'countries.get' })
  getCountries(@Payload() payload: GwResponse): Observable<any> {
    const { params } = payload;
    const lang = params.lg
    return from(this.elandLocationService.findAllCountries());
  }
}
