import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ElandBillingService } from '../eland-billing.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BillingScheduler {
  constructor(
    private readonly httpService: HttpService,
    private readonly billingService: ElandBillingService,
    private readonly configService: ConfigService
  ) {}

  // @Cron('0 0 1 * *') // Runs every 1st of the month
  // async generateMonthlyFinancialReport() {
  //   console.log('🚀 Fetching active properties from Property microservice...');
  //   const property_api = this.configService.get<string>("PROPERTY_API");
  //   try {
  //     // ✅ Request all properties from the Property microservice
  //     const response = await firstValueFrom(this.httpService.get(`${property_api}/properties`));
  //     const properties = response.data;

  //     // ✅ Generate financial reports for each property
  //     for (const property of properties) {
  //       const reportData = await this.billingService.calculateFinancialSummary(property.id);
  //       await this.rabbitMQPublisher.publish('billing.reports', 'financial.bilan.generated', reportData);
  //       console.log(`✅ Financial report published for Property ${property.id}`);
  //     }
  //   } catch (error) {
  //     console.error('⚠️ Failed to fetch properties:', error.message);
  //   }
  // }
}