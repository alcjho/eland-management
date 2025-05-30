import { Controller, Get } from '@nestjs/common';
import { ElandPropertyService } from './eland-property.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { catchError, delay, from, map, Observable, of, throwError } from 'rxjs';

@Controller()
export class ElandPropertyController {
  constructor(private readonly elandPropertyService: ElandPropertyService) {}

  @MessagePattern({ cmd: "add-property" })
  addProperty(@Payload() data: any): Observable<any>{
      return from(this.elandPropertyService.addNewProperty(data.body));
  }

  @MessagePattern({ cmd: "update-property" })
  updateProperty(@Payload() data: any): Observable<any> {
    try {
      const { params } = data.body;
      delete data.body.params;
      delete data.body.query;

      const id = params?.path?.[1]; 
      if (!id) {
        return throwError(() => ({
          status: 400,
          message: "Invalid property ID",
        }));
      }

      return from(this.elandPropertyService.updateProperty(id, data.body)).pipe(
        catchError((error) =>
          of({
            status: 400,
            message: "Property update failed",
            error: error.message,
          })
        )
      );
    } catch (error) {
      return of({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  @MessagePattern({ cmd: "remove-property"})
  removeProperty(@Payload() data: any): Observable<any>{
    const { params } = data.body;
    const propertyId = params.path[1];
    return from(this.elandPropertyService.removeProperty(propertyId));
  }

  @MessagePattern({ cmd: "properties" })
  listProperties(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      delete data.body.params;
      delete data.body.query;
      const ownerId = params.path[1];
      return from(this.elandPropertyService.listMyProperties(ownerId, data.body));
  }

  @MessagePattern({ cmd: "property" })
  getProperty(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      const _id = params.path[1];
      return from(this.elandPropertyService.getProperty(_id));
  }

  @MessagePattern({ cmd: "attach-property-location" })
  attachLocation(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      const propertyId = params.path[1];
      const locationId = params.path[2];
      return from(this.elandPropertyService.attachLocationToProperty(propertyId, locationId));
  }

  @MessagePattern({ cmd: "attach-property-lodge" })
  attachPropertyLodge(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      const propertyId = params.path[1];
      return from(this.elandPropertyService.addNewLodge(propertyId, data.body));
  }

  @MessagePattern({ cmd: "remove-property-lodge" })
  removePropertyFromLodge(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      const propertyId = params.path[1];
      const lodgeId = params.path[2];
      return from(this.elandPropertyService.removeLodge(propertyId, lodgeId));
  }

  @MessagePattern({ cmd: "update-property-lodge" })
  updatePropertyLodge(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      const lodgeId = params.path[1];
      return from(this.elandPropertyService.updateLodge(lodgeId, data.body));
  }

  @MessagePattern({ cmd: "attach-property-parking" })
  attachPropertyParking(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      const propertyId = params.path[1];
      return from(this.elandPropertyService.addNewParking(propertyId, data.body));
  }

  @MessagePattern({ cmd: "remove-property-parking" })
  removePropertyParking(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      const propertyId = params.path[1];
      const parkingId = params.path[2];
      return from(this.elandPropertyService.removeParking(propertyId, parkingId));
  }

  @MessagePattern({ cmd: "update-property-parking" })
  updatePropertyParking(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      const parkingId = params.path[1];
      return from(this.elandPropertyService.updateParking(parkingId, data.body));
  }

  @MessagePattern({ cmd: "attach-property-amenity" })
  attachPropertyAmenity(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      const propertyId = params.path[1];
      return from(this.elandPropertyService.addNewAmenity(propertyId, data.body));
  }

  @MessagePattern({ cmd: "remove-property-amenity" })
  removePropertyAmenity(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      const propertyId = params.path[1];
      const amenityId = params.path[2];
      return from(this.elandPropertyService.removeAmenity(propertyId, amenityId));
  }

  @MessagePattern({ cmd: "update-property-amenity" })
  updatePropertyAmenity(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      const amenityId = params.path[1];
      return from(this.elandPropertyService.updateAmenity(amenityId, data.body));
  }

  @MessagePattern({ cmd: "attach-property-possession" })
  attachPropertyPossession(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      const propertyId = params.path[1];
      return from(this.elandPropertyService.addNewPossession(propertyId, data.body));
  }

  @MessagePattern({ cmd: "remove-property-possession" })
  removePropertyPossession(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      const propertyId = params.path[1];
      const possessionId = params.path[2]
      return from(this.elandPropertyService.removePossession(propertyId, possessionId));
  }

  @MessagePattern({ cmd: "update-property-possession" })
  updatePropertyPossession(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      const possessionId = params.path[1];
      return from(this.elandPropertyService.updatePossession(possessionId, data.body));
  }

  @MessagePattern({ cmd: "attach-lodge-room" })
  attachLodgeRoom(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      const lodgeId = params.path[1];
      return from(this.elandPropertyService.addNewRoom(lodgeId, data.body));
  }

  @MessagePattern({ cmd: "remove-lodge-room" })
  removeLodgeRoom(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      const lodgeId = params.path[1]
      const roomId = params.path[2];
      return from(this.elandPropertyService.removeRoom(lodgeId, roomId));
  }

  @MessagePattern({ cmd: "update-lodge-room" })
  updateLodgeRoom(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      const roomId = params.path[1]
      return from(this.elandPropertyService.updateRoom(roomId, data.body));
  }

  @MessagePattern({ cmd: "assign-lodge-parking" })
  assignLodgeParking(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      const lodgeId = params.path[1]
      const parkingId = params.path[2];
      return from(this.elandPropertyService.assignParkingToLodge(lodgeId, parkingId));
  }

  @MessagePattern({ cmd: "unassign-lodge-parking" })
  unassignLodgeParking(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      const lodgeId = params.path[1]
      const parkingId = params.path[2];
      return from(this.elandPropertyService.unassignParkingFromLodge(lodgeId, parkingId));
  }

  @MessagePattern({ cmd: "assign-lodge-possession" })
  assignLodgePossession(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      const lodgeId = params.path[1]
      const possessionId = params.path[2];
      return from(this.elandPropertyService.assignPossessionToLodge(lodgeId, possessionId));
  }

  @MessagePattern({ cmd: "unassign-lodge-possession" })
  unassignLodgePossession(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      const lodgeId = params.path[1]
      const possessionId = params.path[2];
      return from(this.elandPropertyService.unassignPossessionFromLodge(lodgeId, possessionId));
  }

  @MessagePattern({ cmd: "assign-lodge-amenity" })
  assignLodgeAmenity(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      const lodgeId = params.path[1]
      const amenityId = params.path[2];
      return from(this.elandPropertyService.assignAmenityToLodge(lodgeId, amenityId, data.body));
  }

  @MessagePattern({ cmd: "unassign-lodge-amenity" })
  unassignLodgeAmenity(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      const lodgeId = params.path[1]
      const amenityId = params.path[2];
      return from(this.elandPropertyService.unassignAmenityFromLodge(lodgeId, amenityId));
  }

  @MessagePattern({ cmd: "list-lodges" })
  getLodges(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      delete data.body.params;
      delete data.body.query;
      const propertyId = params.path[1];
      return from(this.elandPropertyService.listLodges(propertyId));
  }

  @MessagePattern({ cmd: "list-parkings" })
  getParkings(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      delete data.body.params;
      delete data.body.query;
      const propertyId = params.path[1];
      return from(this.elandPropertyService.listParkings(propertyId));
  }

  @MessagePattern({ cmd: "list-possessions" })
  getPossessions(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      delete data.body.params;
      delete data.body.query;
      const propertyId = params.path[1];
      return from(this.elandPropertyService.listPossessions(propertyId));
  }

  @MessagePattern({ cmd: "list-amenities" })
  getAmenities(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      delete data.body.params;
      delete data.body.query;
      const propertyId = params.path[1];
      return from(this.elandPropertyService.listAmenities(propertyId));
  }
}
