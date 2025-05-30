import { Controller } from '@nestjs/common';
import { ElandBillingService } from './eland-billing.service';
import { RabbitMQPublisher } from './publishers/rabbitmq.publisher';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { from, Observable } from 'rxjs';

@Controller()
export class ElandBillingController {
  constructor(
    private readonly billingService: ElandBillingService,
  ) {}

  @MessagePattern({ cmd: 'process-payment' }) // ✅ RPC command instead of HTTP
  handleClientPayment(@Payload() data: any): Observable<any> {
    const { params } = data.body;
      const userId = params.path[1];
    const { amount, type } = data.body;
    
     
    return from(this.billingService.processPayment(userId, amount, type));
  }
}
