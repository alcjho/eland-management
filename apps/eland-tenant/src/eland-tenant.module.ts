import { Module } from '@nestjs/common';
import { ElandTenantController } from './eland-tenant.controller';
import { ElandTenantService } from './eland-tenant.service';
import { DatabaseModule } from './database.module';
import { ElandMailModule } from '@eland/eland-library/eland-mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvPath } from './utilities';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantSchema } from './schemas/tenant.schema';
import { StorageSchema } from './schemas/storage.schema';
import { NotificationSchema } from './schemas/notification.schema';

@Module({
  imports: [
    DatabaseModule,
    ElandMailModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [ getEnvPath("eland-tenant"), getEnvPath() ]
    }),
    MongooseModule.forFeature([
      {name: "Tenant", schema: TenantSchema},
      {name: "Storage", schema: StorageSchema},
      {name: "Notification", schema: NotificationSchema},
    ])
  ],
  controllers: [ElandTenantController],
  providers: [ElandTenantService, ConfigService]
})
export class ElandTenantModule {}
