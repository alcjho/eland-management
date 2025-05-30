import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Revenue } from './schemas/revenu.schema';
import { ElandProducerService } from './eland-producer.service';
import { ClientProxy } from '@nestjs/microservices';

interface RevenueDocument extends Document {
  userId: string;
  amount: number;
  type: string;
  paymentStatus: string;
  _id: string;
}

@Injectable()
export class ElandBillingService {
  constructor(
    @InjectModel(Revenue.name) private readonly revenueModel: Model<RevenueDocument>,
    @Inject('BILLING_SERVICE') private rabbitClient: ClientProxy
  ) {}

  /*async getRevenue() {
    // Your existing logic
    return { message: 'Revenue data' };
  }

  async createRevenue(revenueData: any) {
    // Create revenue in database
    const revenue = { id: 1, ...revenueData };
    
    // Publish event to other services
    this.producerService.sendMessage('revenue_created', revenue);
    
    return revenue;
  }

  async getExpenses() {
    // Your existing logic
    return { message: 'Expenses data' };
  }

  async createInvoice(data: any) {
    // Process invoice creation
    const invoice = { id: Date.now(), ...data };
    
    // Emit event after creating invoice
    this.producerService.sendMessage('invoice_created', invoice);
    
    return invoice;
  }

  

  async generateReport(data: any) {
    // Generate billing report
    return { report: 'Generated billing report', ...data };
  }

  async calculateFinancialSummary(propertyId: string){

  }*/

  async processPayment(userId: string, amount: number, type: string) {
    this.rabbitClient.emit('payment_processed', {userId, amount})
    // const revenue = new this.revenueModel({ userId, amount, type, paymentStatus: 'paid' });
    // const payment = await revenue.save();
    // const paymentData = payment.toObject({getters: true, virtuals: true});

    // //publish message
    // const result = await this.producerService.publishMessage('payment_processed', paymentData);
    // console.log("message sent: ", result)
    // return payment;
    return "Order Placed!"
  }
}