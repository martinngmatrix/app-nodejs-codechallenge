import { Module } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { ProducerService } from "src/kafka/producer.service";
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";



@Module({
     controllers: [TransactionController],
     providers: [TransactionService, PrismaService, ProducerService]
})
export class TransactionModule{}