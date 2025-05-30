import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ElandMailService } from './eland-mail.service';

@Module({
  imports: [ConfigModule],
  providers: [ElandMailService],
  exports: [ElandMailService],
})
export class ElandMailModule {}