import { Module } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { ConsumerService } from "src/kafka/consumer.service";
import { PrismaService } from "src/database/prisma.service";

@Module({
    controllers: [],
    providers: [ConsumerService,PrismaService,TransactionService]
})
export class TransactionModule{}