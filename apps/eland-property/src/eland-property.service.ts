import { Inject, Injectable } from '@nestjs/common';
import { PropertyDto } from './dto/property.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Property, PropertyDocument, PropertyStatus, PropertyType } from './schemas/property.schema';
import { RpcException } from '@nestjs/microservices';
import { Parking, ParkingDocument } from './schemas/parking.schema';
import { Lodge, LodgeDocument } from './schemas/lodge.schema';
import { Possession, PossessionDocument } from './schemas/possession.schema';
import { Amenity, AmenityDocument } from './schemas/amenity.schema';
import { Room, RoomDocument } from './schemas/room.schema';
import { getValidationError } from './utilities';


@Injectable()
export class ElandPropertyService {
  constructor(
    @InjectModel('Property') private readonly propertyModel: Model<Property>,
    @InjectModel('Parking') private readonly parkingModel: Model<Parking>,
    @InjectModel('Lodge') private readonly lodgeModel: Model<Lodge>,
    @InjectModel('Possession') private readonly possessionModel: Model<Possession>,
    @InjectModel('Amenity') private readonly amenityModel: Model<Amenity>,
    @InjectModel('Room') private readonly roomModel: Model<Room>
  ){}
   
  /**
   * 
   * @param data 
   * @param lang 
   * @returns 
   */
  async addNewProperty(propertyData: PropertyDto, lang?:string) {
    const { ownerId, name, type, status, description, totalUnits  } = propertyData
      const newProperty = new this.propertyModel({
        ownerId, 
        name, 
        type,
        status,
        description,
        totalUnits
      })
      const res = await newProperty.save();
      return {status: 201, data: res};
  }

  /**
   * 
   * @param data 
   * @param lang 
   * @returns 
   */
  async updateProperty(id: string, data: PropertyDto, lang?:string) {
      const { locationId, name, type, status, description, totalUnits } = data;
      
      const property: PropertyDocument = await this.propertyModel.findById(id);
      if(!property){
        throw new RpcException(`Oops! cannot find this property :  ${id}`);
      }

      if(locationId){
        property.locationId = locationId;
      }

      property.name = name;
      property.description = description;
      property.type = PropertyType[type.toUpperCase()];
      property.status = PropertyStatus[status.toUpperCase()];
      property.totalUnits = totalUnits;
      
      const res = await property.save();
      return {status: 200, data: res};
  }


  async removeProperty(propertyId: string) {
  try {
    // Delete all related objects manually before deleting the property
    await this.lodgeModel.deleteMany({ propertyId });
    await this.parkingModel.deleteMany({ propertyId });
    await this.amenityModel.deleteMany({ propertyId });
    await this.possessionModel.deleteMany({ propertyId });
    await this.roomModel.deleteMany({ propertyId });

    // Delete the property itself
    await this.propertyModel.findByIdAndDelete(propertyId);

    return { status: 200, message: "Property and all related objects were deleted successfully" };
  } catch (error) {
    throw new RpcException({ status: 500, message: "Failed to delete property", error });
  }
}

  /** 🔹 Add a new Lodge and Link it to a Property */
  async addNewLodge(propertyId: string, lodgeData: Partial<LodgeDocument>) {
    // Create a new lodge
    try{
      const newLodge = await this.lodgeModel.create({ ...lodgeData, propertyId });
      // Add lodge reference to the Property document
      await this.propertyModel.findByIdAndUpdate(
        propertyId,
        { $push: { lodges: newLodge._id } },
        { new: true }
      );
      
      return { status: 201, message: "Lodge added successfully", data: newLodge };
    }catch(error){
      return getValidationError(error)
    }
  }

  /**
   * 
   * @param locationId 
   * @param propertyId 
   * @returns 
   */
  async attachLocationToProperty(propertyId: string, locationId: string) {
    const existingProperties: PropertyDocument = await this.propertyModel.findOne({ locationId, isSold: { $ne: false }});
    if(existingProperties){
      throw new RpcException(`Property exists. If this is an ownership transfer please contact the vendor, or call us at 1-888-234-1285`)
    }

    const property: PropertyDocument = await this.propertyModel.findById(propertyId); 
    if(!property){
      throw new RpcException("The system cannot find this property")
    }

    property.locationId = locationId;
    const res = await property.save();

    return {status: 200, data: res};
  }



  /** 🔹 Remove a Lodge and Unlink it from the Property */
  async removeLodge(propertyId: string, lodgeId: string) {
    // Find and delete the Lodge
    const deleteLodge = await this.lodgeModel.findByIdAndDelete(lodgeId);
    if (!deleteLodge) throw new Error("Lodge not found!");

    // Remove Lodge reference from Property
    await this.propertyModel.findByIdAndUpdate(
      propertyId,
      { $pull: { lodges: lodgeId } },
      { new: true }
    );

    return { status: 200, message: "Lodge removed successfully" };
  }

   /** 🔹 Update Lodge */
  async updateLodge(lodgeId: string, updateData: Partial<LodgeDocument>) {
    const updatedLodge = await this.lodgeModel.findByIdAndUpdate(lodgeId, updateData, { new: true });
    if (!updatedLodge) throw new RpcException("Lodge not found!");

    return { status: 200, message: "Lodge updated successfully", data: updatedLodge };
  }

  /** 🔹 Add a new Lodge and Link it to a Property */
  async addNewParking(propertyId: string, parkingData: Partial<ParkingDocument>) {
    // Create a new lodge
    const newParking = await this.parkingModel.create({ ...parkingData, propertyId });

    // Add lodge reference to the Property document
    await this.propertyModel.findByIdAndUpdate(
      propertyId,
      { $push: { parkings: newParking._id } },
      { new: true }
    );

    return { status: 201, message: "Parking added successfully", data: newParking };
  }

  

  /** 🔹 Remove a Lodge and Unlink it from the Property */
  async removeParking(propertyId: string, parkingId: string) {
    // Find and delete the Lodge
    const deleteParking = await this.parkingModel.findByIdAndDelete(parkingId);
    if (!deleteParking) throw new Error("Parking not found!");

    // Remove Lodge reference from Property
    await this.propertyModel.findByIdAndUpdate(
      propertyId,
      { $pull: { parkings: parkingId } },
      { new: true }
    );

    return { status: 200, message: "Parking removed successfully" };
  }

   /** 🔹 Update Parking */
  async updateParking(parkingId: string, updateData: Partial<ParkingDocument>) {
    const updatedParking = await this.parkingModel.findByIdAndUpdate(parkingId, updateData, { new: true });
    if (!updatedParking) throw new Error("Parking not found!");

    return { status: 200, message: "Parking updated successfully", data: updatedParking };
  }



  /** 🔹 Add a new Lodge and Link it to a Property */
  async addNewPossession(propertyId: string, possessionData: Partial<PossessionDocument>) {
    // Create a new lodge
    const newPossession = await this.possessionModel.create({ ...possessionData, propertyId });

    // Add lodge reference to the Property document
    await this.propertyModel.findByIdAndUpdate(
      propertyId,
      { $push: { possessions: newPossession._id } },
      { new: true }
    );

    return { status: 201, message: "Possession added successfully", data: newPossession };
  }

  /** 🔹 Remove a Lodge and Unlink it from the Property */
  async removePossession(propertyId: string, possessionId: string) {
    // Find and delete the Lodge
    const deletePossession = await this.possessionModel.findByIdAndDelete(possessionId);
    if (!possessionId) throw new Error("Possession not found!");

    // Remove Lodge reference from Property
    await this.propertyModel.findByIdAndUpdate(
      propertyId,
      { $pull: { possessions: possessionId } },
      { new: true }
    );

    return { status: 200, message: "Possession removed successfully" };
  }

   /** 🔹 Update Possession */
  async updatePossession(possessionId: string, updateData: Partial<PossessionDocument>) {
    const updatedPossession = await this.possessionModel.findByIdAndUpdate(possessionId, updateData, { new: true });
    if (!updatedPossession) throw new Error("Possession not found!");

    return { status: 200, message: "Possession updated successfully", data: updatedPossession };
  }

  /** 🔹 Add a new Lodge and Link it to a Property */
  async addNewAmenity(propertyId: string, amenityData: Partial<AmenityDocument>) {
    // Create a new lodge
    const newAmenity = await this.amenityModel.create({ ...amenityData, propertyId });

    // Add lodge reference to the Property document
    await this.propertyModel.findByIdAndUpdate(
      propertyId,
      { $push: { amenities: newAmenity._id } },
      { new: true }
    );

    return { status: 201, message: "Amenity added successfully", data: newAmenity };
  }

  /** 🔹 Remove a Lodge and Unlink it from the Property */
  async removeAmenity(propertyId: string, amenityId: string) {
    // Find and delete the Lodge
    const deleteAmenity = await this.amenityModel.findByIdAndDelete(amenityId);
    if (!deleteAmenity) throw new Error("Amenity not found!");

    // Remove Lodge reference from Property
    await this.propertyModel.findByIdAndUpdate(
      propertyId,
      { $pull: { amenities: amenityId } },
      { new: true }
    );

    return { status: 200, message: "Amenity removed successfully" };
  }

  /** 🔹 Update Amenity */
  async updateAmenity(amenityId: string, updateData: Partial<AmenityDocument>) {
    const updatedAmenity = await this.amenityModel.findByIdAndUpdate(amenityId, updateData, { new: true });
    if (!updatedAmenity) throw new Error("Amenity not found!");

    return { status: 200, message: "Amenity updated successfully", data: updatedAmenity };
  }
  
  /**
   * 
   * @param lodgeId 
   * @param parkingId 
   * @returns 
   */
 async assignParkingToLodge(lodgeId: string, parkingId: string) {
  const parking = await this.parkingModel.findById(parkingId);
  if (!parking) throw new RpcException("Parking not found!");
  if (parking.isAssigned) throw new RpcException("Parking is already assigned!");

  await this.parkingModel.findByIdAndUpdate(parkingId, { isAssigned: true, status: "reserved" });
  const updatedLodge = await this.lodgeModel.findByIdAndUpdate(lodgeId, { $push: { parkings: parkingId } });
  console.log("Updated Lodge:", updatedLodge);

  return { status: 200, message: "Parking assigned successfully" };
}

async unassignParkingFromLodge(lodgeId: string, parkingId: string) {
  await this.lodgeModel.findByIdAndUpdate(lodgeId, { $pull: { parkings: parkingId } });

  await this.parkingModel.findByIdAndUpdate(parkingId, { isAssigned: false, status: "available" });

  return { status: 200, message: "Parking unassigned successfully" };
}



  async assignPossessionToLodge(lodgeId, possessionId) {
    const possession = await this.possessionModel.findById(possessionId);

    if (!possession) throw new RpcException("Possession not found!");
    if (possession.isAssigned) throw new RpcException("Possession is already assigned!");

    await this.possessionModel.findByIdAndUpdate(possessionId, { isAssigned: true });
    await this.lodgeModel.findByIdAndUpdate(lodgeId, { $push: { possessions: possessionId } });

    return { status: 200, message: "Possession assigned successfully" };
  }

  async unassignPossessionFromLodge(lodgeId: string, possessionId: string) {
    await this.lodgeModel.findByIdAndUpdate(lodgeId, { $pull: { possessions: possessionId } });

    await this.parkingModel.findByIdAndUpdate(possessionId, { isAssigned: false });

    return { status: 200, message: "Possession unassigned successfully" };
  }

  async assignAmenityToLodge(lodgeId: string, amenityId: string, data: { isPrivate: boolean }) {
    const amenity = await this.amenityModel.findById(amenityId);

      if (!amenity) throw new RpcException("Amenity not found!");
      const alreadyAssigned = await this.lodgeModel.findOne({ amenities: amenityId });
      if (amenity.isPrivate)
        throw new RpcException("Amenity is private !");

      if(alreadyAssigned._id.toString() == lodgeId)
        throw new RpcException("Amenity already assigned this lodge");

      if(data.isPrivate){
        await this.amenityModel.findByIdAndUpdate(amenityId, { isPrivate: true });
      }

      await this.lodgeModel.findByIdAndUpdate(lodgeId, { $push: { amenities: amenityId } });
      return { status: 200, message: "Amenity assigned successfully" };
  }

  async unassignAmenityFromLodge(lodgeId: string, amenityId: string) {
    await this.lodgeModel.findByIdAndUpdate(lodgeId, { $pull: { amenities: amenityId } });
    await this.amenityModel.findByIdAndUpdate(amenityId, { isPrivate: false });

    return { status: 200, message: "Amenity unassigned successfully" };
  }

  
  /**
   * 
   * @param data 
   * @param lang 
   * @returns 
   */
  async listMyProperties(ownerId: string, lang?:string) {
    const properties = await this.propertyModel.find({ ownerId });
    const propertiesWithLodges = await Promise.all(
      properties.map(async (property) => {
        const lodges = await this.lodgeModel.find({ propertyId: property._id });
        return { ...property.toObject(), lodges };
      })
    );
      
    return { status: 200, data: propertiesWithLodges }
  }

  /**
   * 
   * @param propertyId 
   * @param lang 
   * @returns 
   */
  async getProperty(_id: string, lang?:string) {
    const property = await this.propertyModel.findById(_id)
    
    return {status: 200, data: property};
  }

  /** 🔹 Add a new Lodge and Link it to a Property */
  async addNewRoom(lodgeId: string, roomData: Partial<AmenityDocument>) {
    // Create a new lodge
    const newRoom = await this.roomModel.create({ ...roomData, lodgeId });

    // Add lodge reference to the Property document
    await this.lodgeModel.findByIdAndUpdate(
      lodgeId,
      { $push: { rooms: newRoom._id } },
      { new: true }
    );

    return { status: 201, message: "Room added successfully", data: newRoom };
  }

 /** 🔹 Remove a Lodge and Unlink it from the Property */
  async removeRoom(lodgeId: string, roomId: string) {
    // Find and delete the Lodge
    const deleteRoom = await this.roomModel.findByIdAndDelete(roomId);
    if (!deleteRoom) throw new Error("Amenity not found!");

    // Remove Lodge reference from Property
    await this.lodgeModel.findByIdAndUpdate(
      lodgeId,
      { $pull: { rooms: roomId } },
      { new: true }
    );

    return { status: 200, message: "Room removed successfully" };
  }

  /** 🔹 Remove a Lodge and Unlink it from the Property */
  async updateRoom(roomId: string, updateData: Partial<RoomDocument>) {
    const updatedRoom = await this.roomModel.findByIdAndUpdate(roomId, updateData, { new: true });
    if (!updatedRoom) throw new Error("Room not found!");

    return { status: 200, message: "Room updated successfully", data: updatedRoom };
  }

  /**
   * 
   * @param propertyId 
   * @param lang 
   * @returns 
   */
  async listLodges(propertyId: string, lang?:string) {
    const lodgesWithDetails = await this.lodgeModel.find({ propertyId })
    .populate("parkings")
    .populate("possessions")
    .populate("amenities")
    .populate("rooms");

    return { status: 200, data: lodgesWithDetails }
  }

  /**
   * 
   * @param propertyId 
   * @param lang 
   * @returns 
   */
  async listParkings(propertyId: string, lang?:string) {
    const parkings = await this.parkingModel.find({ propertyId })
    return { status: 200, data: parkings }
  }

  /**
   * 
   * @param propertyId 
   * @param lang 
   * @returns 
   */
  async listPossessions(propertyId: string, lang?:string) {
    const possessions = await this.possessionModel.find({ propertyId })
    return { status: 200, data: possessions }
  }

  /**
   * 
   * @param propertyId 
   * @param lang 
   * @returns 
   */
  async listAmenities(propertyId: string, lang?:string) {
    const amenities = await this.amenityModel.find({ propertyId })
    return { status: 200, data: amenities }
  }
}
