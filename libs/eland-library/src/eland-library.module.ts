import { Module } from '@nestjs/common';
import { ElandLibraryService } from './eland-library.service';

@Module({
  providers: [ElandLibraryService],
  exports: [ElandLibraryService],
})
export class ElandLibraryModule {}
