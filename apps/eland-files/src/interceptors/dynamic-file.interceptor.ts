import { FileInterceptor } from '@nestjs/platform-express';
import { ExecutionContext, Injectable, mixin, Type, Inject, CallHandler } from '@nestjs/common';
import { IStorageService, STORAGE_SERVICE_TOKEN } from '../interfaces/storage.interface'; // Adjust path
import { Observable } from 'rxjs';

export function DynamicFileInterceptor(fieldName: string): Type<any> {
  
  class DynamicFileInterceptorClass {
    // 🔑 Inject the service here so it's available at runtime
    constructor(@Inject(STORAGE_SERVICE_TOKEN) private readonly storageService: IStorageService) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      // 🔑 Get the storage engine from the injected service
      const storageEngine = this.storageService.getMulterStorageEngine();

      // Dynamically create and call the Multer interceptor instance
      const interceptor = new (FileInterceptor(fieldName, {
        storage: storageEngine,
      }))();

      return interceptor.intercept(context, next);
    }
  }
  
  // Use 'mixin' to allow NestJS to handle injection into the interceptor
  return mixin(DynamicFileInterceptorClass);
}