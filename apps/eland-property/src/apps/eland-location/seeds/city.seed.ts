import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../entities/city.entity';
import { Province } from '../entities/province.entity';

interface CityData {
  name: { fr: string; en: string };
  provinceCode: string;
}

@Injectable()
export class CitySeed implements OnModuleInit {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
  ) {}

  async onModuleInit() {
    Logger.log(
      "\x1b[33m[ElandLocationModule]\x1b[32m 🚀 Running Database Seeder for Location service...",
    );

    const existingCities = await this.cityRepository.count();
    if (existingCities > 0) {
      Logger.log(
        "\x1b[33m[ElandLocationModule]\x1b[32m ✅ cities are already seeded!",
      );
      return;
    }

    const cities: CityData[] = [
      { name: { fr: 'Toronto', en: 'Toronto' }, provinceCode: 'ON' },
      { name: { fr: 'Montréal', en: 'Montreal' }, provinceCode: 'QC' },
      { name: { fr: 'Vancouver', en: 'Vancouver' }, provinceCode: 'BC' },
      { name: { fr: 'Calgary', en: 'Calgary' }, provinceCode: 'AB' },
      { name: { fr: 'Edmonton', en: 'Edmonton' }, provinceCode: 'AB' },
      { name: { fr: 'Winnipeg', en: 'Winnipeg' }, provinceCode: 'MB' },
      { name: { fr: 'Québec', en: 'Quebec City' }, provinceCode: 'QC' },
      { name: { fr: 'Ottawa', en: 'Ottawa' }, provinceCode: 'ON' },
      { name: { fr: 'Hamilton', en: 'Hamilton' }, provinceCode: 'ON' },
      { name: { fr: 'Kitchener', en: 'Kitchener' }, provinceCode: 'ON' },
      { name: { fr: 'London', en: 'London' }, provinceCode: 'ON' },
      { name: { fr: 'Victoria', en: 'Victoria' }, provinceCode: 'BC' },
      { name: { fr: 'Halifax', en: 'Halifax' }, provinceCode: 'NS' },
      { name: { fr: 'Oshawa', en: 'Oshawa' }, provinceCode: 'ON' },
      { name: { fr: 'Windsor', en: 'Windsor' }, provinceCode: 'ON' },
      { name: { fr: 'Saskatoon', en: 'Saskatoon' }, provinceCode: 'SK' },
      { name: { fr: 'Regina', en: 'Regina' }, provinceCode: 'SK' },
      { name: { fr: "St. John's", en: "St. John's" }, provinceCode: 'NL' },
      { name: { fr: 'Sudbury', en: 'Greater Sudbury' }, provinceCode: 'ON' },
      { name: { fr: 'Sherbrooke', en: 'Sherbrooke' }, provinceCode: 'QC' },
      { name: { fr: 'Barrie', en: 'Barrie' }, provinceCode: 'ON' },
      { name: { fr: 'Kelowna', en: 'Kelowna' }, provinceCode: 'BC' },
      { name: { fr: 'Trois-Rivières', en: 'Trois-Rivières' }, provinceCode: 'QC' },
      { name: { fr: 'Guelph', en: 'Guelph' }, provinceCode: 'ON' },
      { name: { fr: 'Abbotsford', en: 'Abbotsford' }, provinceCode: 'BC' },
      { name: { fr: 'Saint John', en: 'Saint John' }, provinceCode: 'NB' },
      { name: { fr: 'Thunder Bay', en: 'Thunder Bay' }, provinceCode: 'ON' },
      { name: { fr: 'Lethbridge', en: 'Lethbridge' }, provinceCode: 'AB' },
      { name: { fr: 'Peterborough', en: 'Peterborough' }, provinceCode: 'ON' },
      { name: { fr: 'Red Deer', en: 'Red Deer' }, provinceCode: 'AB' },
      { name: { fr: 'Kamloops', en: 'Kamloops' }, provinceCode: 'BC' },
      { name: { fr: 'Chatham-Kent', en: 'Chatham-Kent' }, provinceCode: 'ON' },
      { name: { fr: 'Saguenay', en: 'Saguenay' }, provinceCode: 'QC' },
      { name: { fr: 'Drummondville', en: 'Drummondville' }, provinceCode: 'QC' },
      { name: { fr: 'Saint-Jérôme', en: 'Saint-Jérôme' }, provinceCode: 'QC' },
      { name: { fr: 'Charlottetown', en: 'Charlottetown' }, provinceCode: 'PE' },
      { name: { fr: 'Brantford', en: 'Brantford' }, provinceCode: 'ON' },
      { name: { fr: 'Moncton', en: 'Moncton' }, provinceCode: 'NB' },
      { name: { fr: 'Medicine Hat', en: 'Medicine Hat' }, provinceCode: 'AB' },
      { name: { fr: 'Beloeil', en: 'Beloeil' }, provinceCode: 'QC' },
      { name: { fr: 'Fredericton', en: 'Fredericton' }, provinceCode: 'NB' },
      { name: { fr: 'Cape Breton', en: 'Cape Breton' }, provinceCode: 'NS' },
      { name: { fr: 'Granby', en: 'Granby' }, provinceCode: 'QC' },
      { name: { fr: 'Saint-Jean-sur-Richelieu', en: 'Saint-Jean-sur-Richelieu' }, provinceCode: 'QC' },
      { name: { fr: 'Saint-Georges', en: 'Saint-Georges' }, provinceCode: 'QC' },
      { name: { fr: 'Cornwall', en: 'Cornwall' }, provinceCode: 'ON' },
      { name: { fr: 'North Bay', en: 'North Bay' }, provinceCode: 'ON' },
      { name: { fr: 'Belleville', en: 'Belleville' }, provinceCode: 'ON' },
      { name: { fr: 'Prince George', en: 'Prince George' }, provinceCode: 'BC' },
      { name: { fr: 'Sarnia', en: 'Sarnia' }, provinceCode: 'ON' },
      { name: { fr: 'Moose Jaw', en: 'Moose Jaw' }, provinceCode: 'SK' },
      { name: { fr: 'Levis', en: 'Lévis' }, provinceCode: 'QC' },
      { name: { fr: 'Boucherville', en: 'Boucherville' }, provinceCode: 'QC' },
      { name: { fr: 'Shawinigan', en: 'Shawinigan' }, provinceCode: 'QC' },
      { name: { fr: 'Mascouche', en: 'Mascouche' }, provinceCode: 'QC' },
      { name: { fr: 'Rimouski', en: 'Rimouski' }, provinceCode: 'QC' },
      { name: { fr: 'Châteauguay', en: 'Châteauguay' }, provinceCode: 'QC' },
      { name: { fr: 'Sept-Îles', en: 'Sept-Îles' }, provinceCode: 'QC' },
      { name: { fr: 'Shannon', en: 'Shannon' }, provinceCode: 'QC' },
      { name: { fr: 'Terrace', en: 'Terrace' }, provinceCode: 'BC' },
      { name: { fr: 'Fort McMurray', en: 'Fort McMurray' }, provinceCode: 'AB' },
      { name: { fr: 'Edmundston', en: 'Edmundston' }, provinceCode: 'NB' },
      { name: { fr: 'Mirabel', en: 'Mirabel' }, provinceCode: 'QC' },
      { name: { fr: 'Rouyn-Noranda', en: 'Rouyn-Noranda' }, provinceCode: 'QC' },
      { name: { fr: 'Joliette', en: 'Joliette' }, provinceCode: 'QC' },
      { name: { fr: 'Lloydminster', en: 'Lloydminster' }, provinceCode: 'SK' },
      { name: { fr: 'Orangeville', en: 'Orangeville' }, provinceCode: 'ON' },
      { name: { fr: 'Campbell River', en: 'Campbell River' }, provinceCode: 'BC' },
      { name: { fr: 'Timmins', en: 'Timmins' }, provinceCode: 'ON' },
      { name: { fr: 'Duncan', en: 'Duncan' }, provinceCode: 'BC' },
      { name: { fr: 'Saint-Hyacinthe', en: 'Saint-Hyacinthe' }, provinceCode: 'QC' },
      { name: { fr: 'Woodstock', en: 'Woodstock' }, provinceCode: 'ON' },
      { name: { fr: 'Salmon Arm', en: 'Salmon Arm' }, provinceCode: 'BC' },
      { name: { fr: 'Chilliwack', en: 'Chilliwack' }, provinceCode: 'BC' },
      { name: { fr: 'Brockville', en: 'Brockville' }, provinceCode: 'ON' },
      { name: { fr: 'Leduc', en: 'Leduc' }, provinceCode: 'AB' },
      { name: { fr: 'Cochrane', en: 'Cochrane' }, provinceCode: 'ON' },
      { name: { fr: 'Yorkton', en: 'Yorkton' }, provinceCode: 'SK' },
      { name: { fr: 'Parksville', en: 'Parksville' }, provinceCode: 'BC' },
      { name: { fr: 'Laval', en: 'Laval' }, provinceCode: 'QC' },
      { name: { fr: 'Longueuil', en: 'Longueuil' }, provinceCode: 'QC' },
      { name: { fr: 'Repentigny', en: 'Repentigny' }, provinceCode: 'QC' },
      { name: { fr: 'Blainville', en: 'Blainville' }, provinceCode: 'QC' },
      { name: { fr: 'Dollard-des-Ormeaux', en: 'Dollard-des-Ormeaux' }, provinceCode: 'QC' },
      { name: { fr: 'Beauharnois', en: 'Beauharnois' }, provinceCode: 'QC' },
      { name: { fr: 'Boisbriand', en: 'Boisbriand' }, provinceCode: 'QC' },
      { name: { fr: 'Mont-Saint-Hilaire', en: 'Mont-Saint-Hilaire' }, provinceCode: 'QC' },
      { name: { fr: 'Sorel-Tracy', en: 'Sorel-Tracy' }, provinceCode: 'QC' },
      { name: { fr: 'Thetford Mines', en: 'Thetford Mines' }, provinceCode: 'QC' },
      { name: { fr: 'Magog', en: 'Magog' }, provinceCode: 'QC' },
      { name: { fr: 'Saint-Eustache', en: 'Saint-Eustache' }, provinceCode: 'QC' },
      { name: { fr: 'Saint-Lin-Laurentides', en: 'Saint-Lin-Laurentides' }, provinceCode: 'QC' },
      { name: { fr: 'Saint-Bruno-de-Montarville', en: 'Saint-Bruno-de-Montarville' }, provinceCode: 'QC' },
      { name: { fr: 'Saint-Basile-le-Grand', en: 'Saint-Basile-le-Grand' }, provinceCode: 'QC' },
      { name: { fr: 'Chambly', en: 'Chambly' }, provinceCode: 'QC' },
      { name: { fr: "L'Assomption", en: "L'Assomption" }, provinceCode: 'QC' },
      { name: { fr: 'Val-d\'Or', en: 'Val-d\'Or' }, provinceCode: 'QC' },
      { name: { fr: 'Victoriaville', en: 'Victoriaville' }, provinceCode: 'QC' },
      { name: { fr: 'La Tuque', en: 'La Tuque' }, provinceCode: 'QC' },
      { name: { fr: 'Dolbeau-Mistassini', en: 'Dolbeau-Mistassini' }, provinceCode: 'QC' },
      { name: { fr: 'Alma', en: 'Alma' }, provinceCode: 'QC' },
      { name: { fr: 'Chibougamau', en: 'Chibougamau' }, provinceCode: 'QC' },
      { name: { fr: 'Baie-Comeau', en: 'Baie-Comeau' }, provinceCode: 'QC' },
      { name: { fr: 'Amos', en: 'Amos' }, provinceCode: 'QC' },
      { name: { fr: 'Mont-Laurier', en: 'Mont-Laurier' }, provinceCode: 'QC' },
      { name: { fr: 'Gaspé', en: 'Gaspé' }, provinceCode: 'QC' },
      { name: { fr: 'Chandler', en: 'Chandler' }, provinceCode: 'QC' },
      { name: { fr: 'Port-Cartier', en: 'Port-Cartier' }, provinceCode: 'QC' },
      { name: { fr: 'Fermont', en: 'Fermont' }, provinceCode: 'QC' },
      { name: { fr: 'Matane', en: 'Matane' }, provinceCode: 'QC' },
      { name: { fr: 'Rivière-du-Loup', en: 'Rivière-du-Loup' }, provinceCode: 'QC' },
      { name: { fr: 'Montmagny', en: 'Montmagny' }, provinceCode: 'QC' },
      { name: { fr: 'Saint-Félicien', en: 'Saint-Félicien' }, provinceCode: 'QC' },
      { name: { fr: 'Mont-Tremblant', en: 'Mont-Tremblant' }, provinceCode: 'QC' },
      { name: { fr: 'Saint-Raymond', en: 'Saint-Raymond' }, provinceCode: 'QC' },
      { name: { fr: 'Rawdon', en: 'Rawdon' }, provinceCode: 'QC' },
      { name: { fr: 'Sainte-Adèle', en: 'Sainte-Adèle' }, provinceCode: 'QC' },
      { name: { fr: 'Valcourt', en: 'Valcourt' }, provinceCode: 'QC' },
      { name: { fr: 'Baie-Saint-Paul', en: 'Baie-Saint-Paul' }, provinceCode: 'QC' },
      { name: { fr: 'Saint-Pascal', en: 'Saint-Pascal' }, provinceCode: 'QC' },
      { name: { fr: 'Mont-Joli', en: 'Mont-Joli' }, provinceCode: 'QC' },
      { name: { fr: 'Dolbeau', en: 'Dolbeau' }, provinceCode: 'QC' },
      { name: { fr: 'Saint-Tite', en: 'Saint-Tite' }, provinceCode: 'QC' },
      { name: { fr: 'La Sarre', en: 'La Sarre' }, provinceCode: 'QC' },
      { name: { fr: 'Cap-Chat', en: 'Cap-Chat' }, provinceCode: 'QC' },
      { name: { fr: 'La Malbaie', en: 'La Malbaie' }, provinceCode: 'QC' },
      { name: { fr: 'Saint-Augustin', en: 'Saint-Augustin' }, provinceCode: 'QC' },
      { name: { fr: 'Saint-Sauveur', en: 'Saint-Sauveur' }, provinceCode: 'QC' },
      { name: { fr: 'Louiseville', en: 'Louiseville' }, provinceCode: 'QC' },
      { name: { fr: 'Val-des-Monts', en: 'Val-des-Monts' }, provinceCode: 'ON' },
      { name: { fr: 'Montpellier', en: 'Montpellier' }, provinceCode: 'QC' },
      { name: { fr: 'Dégelis', en: 'Dégelis' }, provinceCode: 'QC' },
      { name: { fr: 'Saint-Jovite', en: 'Saint-Jovite' }, provinceCode: 'QC' },
      { name: { fr: 'Sainte-Agathe-des-Monts', en: 'Sainte-Agathe-des-Monts' }, provinceCode: 'QC' },
      { name: { fr: 'Saint-Martin', en: 'Saint-Martin' }, provinceCode: 'QC' },
      { name: { fr: 'Tracadie-Sheila', en: 'Tracadie-Sheila' }, provinceCode: 'NB' },
      { name: { fr: 'Gander', en: 'Gander' }, provinceCode: 'NL' },
      { name: { fr: 'Grand Falls-Windsor', en: 'Grand Falls-Windsor' }, provinceCode: 'NL' },
      { name: { fr: 'Labrador City', en: 'Labrador City' }, provinceCode: 'NL' },
      { name: { fr: 'Corner Brook', en: 'Corner Brook' }, provinceCode: 'NL' },
      { name: { fr: 'Channel-Port aux Basques', en: 'Channel-Port aux Basques' }, provinceCode: 'NL' },
      { name: { fr: 'Deer Lake', en: 'Deer Lake' }, provinceCode: 'NL' },
      { name: { fr: 'Happy Valley-Goose Bay', en: 'Happy Valley-Goose Bay' }, provinceCode: 'NL' },
      { name: { fr: 'Marystown', en: 'Marystown' }, provinceCode: 'NL' },
      { name: { fr: 'Carbonear', en: 'Carbonear' }, provinceCode: 'NL' },
      { name: { fr: 'Stephenville', en: 'Stephenville' }, provinceCode: 'NL' },
      { name: { fr: 'Clarenville', en: 'Clarenville' }, provinceCode: 'NL' },
      { name: { fr: 'Springdale', en: 'Springdale' }, provinceCode: 'NL' },
      { name: { fr: 'Lewisporte', en: 'Lewisporte' }, provinceCode: 'NL' },
      { name: { fr: 'Placentia', en: 'Placentia' }, provinceCode: 'NL' },
      { name: { fr: "Bishop's Falls", en: "Bishop's Falls" }, provinceCode: 'NL' },
      { name: { fr: 'Botwood', en: 'Botwood' }, provinceCode: 'NL' },
      { name: { fr: 'Fogo Island', en: 'Fogo Island' }, provinceCode: 'NL' },
      { name: { fr: 'Whitehorse', en: 'Whitehorse' }, provinceCode: 'YT' },
    ];

    for (const cityData of cities) {
      const province = await this.provinceRepository.findOne({
        where: { code: cityData.provinceCode },
      });

      if (!province) {
        Logger.warn(
          `\x1b[33m[ElandLocationModule]\x1b[33m ⚠️ Province ${cityData.provinceCode} not found for city ${cityData.name.en}`,
        );
        continue;
      }

      const city = this.cityRepository.create({
        name: cityData.name,
        province,
      });
      await this.cityRepository.save(city);
    }

    Logger.log(
      "\x1b[33m[ElandLocationModule]\x1b[32m ✅ cities seeded successfully!",
    );
  }
}