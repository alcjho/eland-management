import { Module } from '@nestjs/common';
import { ElandBillingController } from './eland-billing.controller';
import { ElandBillingService } from './eland-billing.service';
import { DatabaseModule } from './database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RevenueSchema } from './schemas/revenu.schema';
import { ExpenseSchema } from './schemas/expense.schema';
import { DebtSchema } from './schemas/debt.schema';
import { TransactionSchema } from './schemas/transaction.schema';
import { NotificationSchema } from './schemas/notification.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvPath } from './utilities';
import { ElandMailModule } from '@eland/eland-library/eland-mail.module';
import { HttpModule } from '@nestjs/axios';
import { ElandProducerService } from './eland-producer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { rabbitMQConfig } from './rmq.options';

@Module({
  imports: [
    DatabaseModule,
    ElandMailModule,
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [getEnvPath("eland-billing"), getEnvPath()]
    }),
    MongooseModule.forFeature([
      { name: 'Revenue', schema: RevenueSchema },
      { name: 'Expense', schema: ExpenseSchema },
      { name: 'Debt', schema: DebtSchema },
      { name: 'Transaction', schema: TransactionSchema },
      { name: 'Notification', schema: NotificationSchema }
    ]),
    ClientsModule.register([
      {
        name: 'BILLING_SERVICE', 
        ...rabbitMQConfig
      }
    ])
  ],
  controllers: [ElandBillingController],
  providers: [
    ElandBillingService, 
    ElandBillingModule, 
    ElandProducerService,
    ConfigService 
  ],
})
export class ElandBillingModule {}