import { Controller, Get } from '@nestjs/common';
import { ElandLocationService } from './eland-location.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { from, Observable } from 'rxjs';
import { LocationDto } from './dtos/location.dto';
import { CityDto } from './dtos/city.dto';

@Controller()
export class ElandLocationController {
  constructor(private readonly elandLocationService: ElandLocationService) {}

  @MessagePattern({ cmd: 'add-location' })
  addLocation(@Payload() payload: any): Observable<any> {
    const data: LocationDto = payload.body;
    return from(this.elandLocationService.createLocation(data));
  }

  @MessagePattern({ cmd: 'add-city' })
  addCity(@Payload() payload: any): Observable<any> {
    const data: CityDto = payload.body;
    return from(this.elandLocationService.addCity(data));
  }

  @MessagePattern({ cmd: 'update-location' })
  updateLocation(@Payload() payload: any): Observable<any> {
    const data: LocationDto = payload.body;
    const { path } = payload.body?.params;

    if (!Array.isArray(path) || path.length < 2) {
      throw new RpcException("Missing location ID in request.");
    }
    const id = path[1];
    return from(this.elandLocationService.updateLocation(id, data));
  }
}
