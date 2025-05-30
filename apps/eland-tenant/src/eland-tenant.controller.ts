import { Controller, Get } from '@nestjs/common';
import { ElandTenantService } from './eland-tenant.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Observable, from} from 'rxjs';

@Controller()
export class ElandTenantController {
  constructor(private readonly tenantService: ElandTenantService) {}

  @EventPattern('payment_processed')
  async handlePaymentProcess(@Payload() data: { userId: string, amount: string }) {
    console.log('Recieved message: ', data)
  }

  @MessagePattern({ cmd: "add-tenant" })
  addNewTenant(@Payload() data: any): Observable<any>{
      const { params } = data.body;
      const userId = params.path[1];

      return from(this.tenantService.addTenant(userId, data.body));
  }
}