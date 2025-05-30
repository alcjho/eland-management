import { Injectable } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { rabbitMQConfig } from "./rmq.options";

@Injectable()
export class ElandProducerService {
    private client: ClientProxy;

    constructor() {
        this.client = ClientProxyFactory.create(rabbitMQConfig());
    }

    async publishMessage(pattern: string, data: any): Promise<any> {
        console.log("Emit to tenant about payment")
        return this.client.emit(pattern, data);
    }

    async sendMessage(pattern: string, data: any): Promise<any> {
        console.log("Send Message to tenant about payment")
        return this.client.send(pattern, data);
    }
}