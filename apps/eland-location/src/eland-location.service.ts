import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { City } from "./schemas/city.schema";
import { Province } from "./schemas/province.schema";
import { Country } from "./schemas/country.schema";
import { LocationDto } from "./dtos/location.dto";
import { CityDto } from "./dtos/city.dto";
import { RpcException } from "@nestjs/microservices";
import { LocationDocument } from "./schemas/location.schema";

@Injectable()
export class ElandLocationService {
  constructor(
    @InjectModel('Location') private readonly locationModel: Model<Location>,
    @InjectModel('City') private readonly cityModel: Model<City>,
    @InjectModel('Province') private readonly provinceModel: Model<Province>,
    @InjectModel('Country') private readonly countryModel: Model<Country>
  ) {}

  /**
   * 
   * @param data 
   * @param lang 
   * @returns 
   */
  async createLocation(data: LocationDto, lang?:string) {
    const nameField = lang === 'fr' ? 'name.fr' : 'name.en';
    const formattedPostalCode = data.zipcode?.replace(/\s+/g, '');
    
    // if(data.property_type == 'residential' && !data.apt_no){
    //   throw new RpcException("A residential property requires an apartment number")
    // }

    // validate that a commercial location already exists
    const existingCommerce = await this.getCommerceLocation(data);
    if(existingCommerce){
      return existingCommerce.populate(['city', 'province', 'country']);
    }

    // validate that an industrial location already exists
    const existingIndustry = await this.getIndustryLocation(data);
    if(existingIndustry){
      return existingIndustry.populate(['city', 'province', 'country']);
    }

    const city = await this.cityModel.findOne({ [nameField]: data.city }).exec();
    if (!city) {
      throw new Error(`City '${data.city}' not found.`);
    }

    // Ensure province exists
    const province = await this.provinceModel.findOne({ code: data.province }).exec();
    if (!province) {
      throw new Error(`Province '${data.province}' not found.`);
    }

    // Ensure country exists
    const country = await this.countryModel.findOne({  code: data.country }).exec();
    if (!country) {
      throw new Error(`Country '${data.country}' not found.`);
    }

    // Create new location
    const newLocation = new this.locationModel({
      street_no: data.street_no,
      property_type: data.property_type,
      street_name: data.street_name,
      ...data.building_name && { building_name: data.building_name },
      ...data.pobox && { pobox: data.pobox },
      ...data.apt_no && { apt_no: data.apt_no },
      ...data.suite_no && { suite_no: data.suite_no },
      ...data.lot_no && { lot_no: data.lot_no },
      ...data.unit_no && { unit_no: data.unit_no },
      zipcode: formattedPostalCode,
      pobox: data.pobox,
      city: city._id,
      province: province._id,
      country: country._id
    });
    
    const result = await newLocation.save();
    // retrieve whole city, province and country objects
    return result.populate(['city', 'province', 'country']);
  }

  async getLocation(locationId: string){
    
    const existingLocation =  await this.locationModel.findById(locationId);

    // if so return the same location to the client
    if(!existingLocation){
      return;
    }

    return existingLocation.populate(['city', 'province', 'country']);
  }

  async getLocationBatch(locationIds: string[], offset: number = 0, limit: number = 100) {
    console.log('locationIds', locationIds)
    // Convert string IDs to ObjectId (as previously discussed)
    const objectIds = locationIds.map(id => new this.locationModel.base.Types.ObjectId(id));

    const locationBatch = await this.locationModel.find({
        _id: { $in: objectIds }
    })
    .populate(['city', 'province', 'country'])
    .skip(offset)
    .limit(limit)
    .exec();

    return { status: 201, data: locationBatch };
  }

  async getCommerceLocation(data: LocationDto){
    const { property_type, street_no, apt_no, unit_no, suite_no, zipcode } = data;

    if(property_type == 'commercial'){
      if(!suite_no && !unit_no){
        throw new RpcException("A commercial property requires a unit_no and/or a suite_no")
      }

      // verify the location exists for a commercial building
      const existingLocation = await this.locationModel.findOne({
        $or: [
          { street_no, unit_no, zipcode },
          { street_no, suite_no, zipcode }
        ]
      });

      // if so return the same location to the client
      if(!existingLocation){
        return;
      }

      return existingLocation.populate(['city', 'province', 'country']);
    }
    return;
  }

  async getIndustryLocation(data: LocationDto){
    const { property_type, street_no, apt_no, unit_no, suite_no, zipcode } = data;

    if(property_type == 'industrial'){
      if(!unit_no){
        throw new RpcException("An industrial property requires at least a unit_no")
      }

      // verify the location exists for an industrial building
      const existingLocation = await this.locationModel.findOne({ street_no, unit_no, zipcode });

      // if so return the same location to the client
      if(!existingLocation){
        return;
      }

      return existingLocation.populate(['city', 'province', 'country']);
    }
    return;
  }

  /**
   * 
   * @param id 
   * @param data 
   * @param lang 
   * @returns 
   */
  async updateLocation(id: string, data: LocationDto, lang?: string) {
    const nameField = lang === 'fr' ? 'name.fr' : 'name.en';
    const formattedPostalCode = data.zipcode?.replace(/\s+/g, '');

    // Find location to update
    const location: LocationDocument | null = await this.locationModel.findById(id);
    if (!location) {
      throw new RpcException(`Location id '${id}' not found.`);
    }

    // Ensure city exists
    const city = await this.cityModel.findOne({ [nameField]: data.city }).exec();
    if (!city) {
      throw new RpcException(`City '${data.city}' not found.`);
    }

    // Ensure province exists
    const province = await this.provinceModel.findOne({ code: data.province }).exec();
    if (!province) {
      throw new RpcException(`Province '${data.province}' not found.`);
    }

    // Ensure country exists
    const country = await this.countryModel.findOne({ code: data.country }).exec();
    if (!country) {
      throw new RpcException(`Country '${data.country}' not found.`);
    }
    
    // Update location with new values
    location.street_no = data.street_no;
    location.street_name = data.street_name;
    location.zipcode = formattedPostalCode;
    location.pobox = data.pobox;
    location.city = city._id;
    location.province = province._id;
    location.country = country._id;

    const result = await location.save();
    
    // Populate related fields before returning
    return result.populate(['city', 'province', 'country']);
  }

  /**
   * 
   * @param data 
   * @param lang 
   * @returns 
   */
  async addCity(data: CityDto, lang?:string) {
    lang = lang? lang: 'en';

    // Ensure city exists
    const city = await this.cityModel.findOne({ name: data.name }).exec();
    if (city) {
      throw new RpcException(`City ${data.name[lang]} alreaydy exists`)
    }

    const newCity = new this.cityModel({
        name: data.name
    })
    const result = newCity.save();
    return result;
  }

  /**
   * @param lang 
   * @returns 
   */
  async findAllCities(lang?:string) {
    const language = lang? lang: 'en';

    const projection = {
      _id: 1, // Always include the ID
      name: `$name.${language}` // Project the localized name field as 'name'
    };

    const query = {
      [`name.${language}`]: { $exists: true }
    };

    // Ensure city exists
    const result = await this.cityModel.find(query).select(projection).exec();
    return result
  }

  /**
   * @param lang 
   * @returns 
   */
  async findAllProvinces(lang?:string) {
    const language = lang? lang: 'en';

    const projection = {
      _id: 1, // Always include the ID
      name: `$name.${language}`, // Project the localized name field as 'name'
      code: `$code`
    };

    const query = {
      [`name.${language}`]: { $exists: true }
    };

    // Ensure city exists
    const result = await this.provinceModel.find(query).select(projection).exec();
    return result
  }

  /**
   * @param lang
   * @returns 
   */
  async findAllCountries(lang?:string) {
    const language = lang? lang: 'en';

    const projection = {
      _id: 1, // Always include the ID
      name: `$name.${language}`, // Project the localized name field as 'name'
      code: `$code`
    };

    const query = {
      [`name.${language}`]: { $exists: true }
    };

    // Ensure city exists
    const result = await this.countryModel.find(query).select(projection).exec();
    return result
  }
}