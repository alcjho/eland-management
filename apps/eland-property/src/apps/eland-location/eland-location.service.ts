import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { City } from './entities/city.entity';
import { Province } from './entities/province.entity';
import { Country } from './entities/country.entity';
import { Location, PropertyType } from './entities/location.entity';
import { LocationDto } from './dto/location.dto';
import { CityDto } from './dto/city.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ElandLocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  /**
   * Create a new location with deduplication for all property types
   */
  async createLocation(data: LocationDto, lang?: string) {
    const nameField = lang ? lang : 'en';
    const formattedPostalCode = data.zipcode?.replace(/\s+/g, '');
    const dataWithFormattedZip = { ...data, zipcode: formattedPostalCode };

    // 1. Deduplication Logic: Check if location exists based on property type
    const existingCommerce = await this.getCommerceLocation(dataWithFormattedZip);
    if (existingCommerce) return existingCommerce;

    const existingIndustry = await this.getIndustryLocation(dataWithFormattedZip);
    if (existingIndustry) return existingIndustry;

    const existingResidential = await this.getResidentialLocation(dataWithFormattedZip);
    if (existingResidential) return existingResidential;

    // 2. If no existing location, proceed with creation logic
    const city = await this.cityRepository.findOne({
      where: {
        name: Raw((alias) => `${alias} ->> '${nameField}' = :cityName`, {
          cityName: data.city,
        }),
      },
    });

    const province = await this.provinceRepository.findOne({
      where: { code: data.province },
    });
    if (!province) throw new Error(`Province '${data.province}' not found.`);

    const country = await this.countryRepository.findOne({
      where: { code: data.country },
    });
    if (!country) throw new Error(`Country '${data.country}' not found.`);

    // Create new location
    const newLocation = this.locationRepository.create({
      propertyType: data.property_type as PropertyType,
      streetNo: data.street_no,
      streetName: data.street_name,
      buildingName: data.building_name,
      pobox: data.pobox,
      aptNo: data.apt_no,
      suiteNo: data.suite_no,
      lotNo: data.lot_no,
      unitNo: data.unit_no,
      zipcode: formattedPostalCode,
      city,
      province,
      country,
    });

    return this.locationRepository.save(newLocation);
  }

  async getLocation(locationId: string) {
    const existingLocation = await this.locationRepository.findOne({
      where: { id: locationId },
      relations: ['city', 'province', 'country'],
    });

    if (!existingLocation) {
      return;
    }

    return existingLocation;
  }

  async getLocationBatch(locationIds: string[], offset: number = 0, limit: number = 100) {
    const locationBatch = await this.locationRepository
      .createQueryBuilder('location')
      .whereInIds(locationIds)
      .leftJoinAndSelect('location.city', 'city')
      .leftJoinAndSelect('location.province', 'province')
      .leftJoinAndSelect('location.country', 'country')
      .skip(offset)
      .take(limit)
      .getMany();

    return { status: 201, data: locationBatch };
  }

  removeLocation(locationId: string) {
    return this.locationRepository.delete(locationId);
  }

  async getCommerceLocation(data: LocationDto) {
    const { property_type, street_no, apt_no, unit_no, suite_no, zipcode } = data;

    if (property_type === 'commercial') {
      if (!suite_no && !unit_no) {
        throw new RpcException('A commercial property requires a unit_no and/or a suite_no');
      }

      // verify the location exists for a commercial building
      const query = this.locationRepository
        .createQueryBuilder('location')
        .where('location.streetNo = :streetNo', { streetNo: street_no })
        .andWhere('location.zipcode = :zipcode', { zipcode });

      if (unit_no) {
        query.andWhere('location.unitNo = :unitNo', { unitNo: unit_no });
      }
      if (suite_no) {
        query.andWhere('location.suiteNo = :suiteNo', { suiteNo: suite_no });
      }

      const existingLocation = await query
        .leftJoinAndSelect('location.city', 'city')
        .leftJoinAndSelect('location.province', 'province')
        .leftJoinAndSelect('location.country', 'country')
        .getOne();

      if (!existingLocation) {
        return;
      }

      return existingLocation;
    }
    return;
  }

  async getIndustryLocation(data: LocationDto) {
    const { property_type, street_no, unit_no, zipcode } = data;

    if (property_type === 'industrial') {
      if (!unit_no) {
        throw new RpcException('An industrial property requires at least a unit_no');
      }

      // verify the location exists for an industrial building
      const existingLocation = await this.locationRepository.findOne({
        where: {
          streetNo: street_no,
          unitNo: unit_no,
          zipcode,
        },
        relations: ['city', 'province', 'country'],
      });

      if (!existingLocation) {
        return;
      }

      return existingLocation;
    }
    return;
  }

  /**
   * Deduplicate Residential Locations
   */
  async getResidentialLocation(data: LocationDto) {
    const { property_type, street_no, apt_no, unit_no, zipcode } = data;

    if (property_type === 'residential') {
      // For residential, if it's a house, apt/unit might be null. 
      // If it's a lodge/apartment, one of them should be present.
      const query = this.locationRepository
        .createQueryBuilder('location')
        .where('location.propertyType = :type', { type: 'residential' })
        .andWhere('location.streetNo = :streetNo', { streetNo: street_no })
        .andWhere('location.zipcode = :zipcode', { zipcode });

      // Handle nullable fields strictly to distinguish between "Apt 1" and "Main House (null)"
      if (apt_no) {
        query.andWhere('location.aptNo = :aptNo', { aptNo: apt_no });
      } else {
        query.andWhere('location.aptNo IS NULL');
      }

      if (unit_no) {
        query.andWhere('location.unitNo = :unitNo', { unitNo: unit_no });
      } else {
        query.andWhere('location.unitNo IS NULL');
      }

      return await query
        .leftJoinAndSelect('location.city', 'city')
        .leftJoinAndSelect('location.province', 'province')
        .leftJoinAndSelect('location.country', 'country')
        .getOne();
    }
    return null;
  }

  /**
   * Update an existing location
   * @param id
   * @param data
   * @param lang
   * @returns
   */
  async updateLocation(id: string, data: LocationDto, lang?: string) {
    const nameField = lang === 'fr' ? 'fr' : 'en';
    const formattedPostalCode = data.zipcode?.replace(/\s+/g, '');

    // Find location to update
    const location = await this.locationRepository.findOne({
      where: { id },
      relations: ['city', 'province', 'country'],
    });
    if (!location) {
      throw new RpcException(`Location id '${id}' not found.`);
    }

    // Ensure city exists
    const cityQuery = this.cityRepository.createQueryBuilder('city')
      .where(`city.name ->> '${nameField}' = :cityName`, { cityName: data.city });

    console.log('City lookup query:', cityQuery.getSql());
    console.log('City lookup params:', { cityName: data.city });

    const city = await cityQuery.getOne();
    if (!city) {
      throw new RpcException(`City '${data.city}' not found.`);
    }

    // Ensure province exists
    const province = await this.provinceRepository.findOne({
      where: { code: data.province },
    });
    if (!province) {
      throw new RpcException(`Province '${data.province}' not found.`);
    }

    // Ensure country exists
    const country = await this.countryRepository.findOne({
      where: { code: data.country },
    });
    if (!country) {
      throw new RpcException(`Country '${data.country}' not found.`);
    }

    // Update location with new values
    location.streetNo = data.street_no;
    location.streetName = data.street_name;
    location.zipcode = formattedPostalCode;
    location.pobox = data.pobox;
    location.city = city;
    location.province = province;
    location.country = country;

    return this.locationRepository.save(location);
  }

  /**
   * Add a new city
   * @param data
   * @param lang
   * @returns
   */
  async addCity(data: CityDto, lang?: string) {
    lang = lang ? lang : 'en';

    // Ensure city doesn't already exist
    const city = await this.cityRepository.findOne({
      where: { name: { [lang]: data.name[lang] } },
    });
    if (city) {
      throw new RpcException(`City ${data.name[lang]} already exists`);
    }

    const newCity = this.cityRepository.create({
      name: data.name,
    });
    return this.cityRepository.save(newCity);
  }

  /**
   * Find all cities
   * @param lang
   * @returns
   */
  async findAllCities(lang?: string) {
    const language = lang ? lang : 'en';

    const cities = await this.cityRepository.find({
      select: {
        id: true,
        name: true,
      },
    });

    // Extract the localized name for each city
    return cities.map((city) => ({
      id: city.id,
      name: city.name[language],
    }));
  }

  /**
   * Find all provinces
   * @param lang
   * @returns
   */
  async findAllProvinces(lang?: string) {
    const language = lang ? lang : 'en';

    const provinces = await this.provinceRepository.find({
      select: {
        id: true,
        name: true,
        code: true,
      },
    });

    // Extract the localized name for each province
    return provinces.map((province) => ({
      id: province.id,
      name: province.name[language],
      code: province.code,
    }));
  }

  /**
   * Find all countries
   * @param lang
   * @returns
   */
  async findAllCountries(lang?: string) {
    const language = lang ? lang : 'en';

    const countries = await this.countryRepository.find({
      select: {
        id: true,
        name: true,
        code: true,
      },
    });

    // Extract the localized name for each country
    return countries.map((country) => ({
      id: country.id,
      name: country.name[language],
      code: country.code,
    }));
  }
}