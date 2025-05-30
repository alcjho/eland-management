    import { Injectable, Inject } from '@nestjs/common';
    import { ClientProxy } from '@nestjs/microservices';

    @Injectable()
    export class RabbitMQPublisher {
    constructor(
        @Inject('BILLING_SERVICE') private readonly client: ClientProxy,
    ) {}

    async publish(pattern: string, data: any) {
        return this.client.emit(pattern, data);
    }

    async sendMessage(pattern: string, data: any) {
        return this.client.send(pattern, data);
    }
}