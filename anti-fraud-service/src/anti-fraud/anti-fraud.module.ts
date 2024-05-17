import { Module } from "@nestjs/common";
import { AntiFraudService } from "./anti-fraud.service";
import { ConsumerService } from "src/kafka/consumer.service";
import { ProducerService } from "src/kafka/producer.service";

@Module({
    controllers: [],
    providers: [ProducerService,ConsumerService,AntiFraudService]
})
export class AntiFraudModule{}