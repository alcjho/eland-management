import { Transport, RmqOptions } from "@nestjs/microservices";

export const rabbitMQConfig = (): RmqOptions => ({
    transport: Transport.RMQ,
    options: {
        urls: ["amqp://eland:Passwords01@127.0.0.1:5672"],
        queue: 'payment_queue'
    }
})