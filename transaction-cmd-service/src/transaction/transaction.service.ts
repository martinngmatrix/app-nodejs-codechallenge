import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { ProducerService } from "../kafka/producer.service"
import { TransactionEvent } from "./resources/transaction.event";
import { Transaction } from "./transaction.model";
import { TransactionInput } from "./resources/transaction.input";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionService {
    constructor(private prisma : PrismaService, private producer : ProducerService) {}

    async createTransaction(transactionData: TransactionInput): Promise<TransactionEvent>{
        const transactionEvent = this.buildEvent(transactionData)
        const transactionObject = new Transaction()
        transactionObject.accountExternalIdCredit = transactionData.accountExternalIdCredit
        transactionObject.accountExternalIdDebit = transactionData.accountExternalIdDebit
        transactionObject.data = JSON.stringify(transactionEvent)
        const transactionEventCopy = {
            accountExternalIdCredit: transactionData.accountExternalIdCredit,
            accountExternalIdDebit: transactionData.accountExternalIdDebit,
            ...transactionEvent
        }
        await this.publishTransaction(transactionEventCopy)
        const response = await this.prisma.transaction.create({
            data : transactionObject
        })
        return JSON.parse(response.data)
    }

    private async publishTransaction(data : TransactionEvent){
        await this.producer.produce({
            topic: 'transaction.pending.topic',
            messages: [
                {
                    value: JSON.stringify(data)
                }
            ]
        })
    }

    private buildEvent(transactionData: TransactionInput) : TransactionEvent {
        const transactionEvent = {
            transactionExternalId: uuidv4(),
            transactionType: {
                name: String(transactionData.tranferTypeId)
            },
            transactionStatus: {
                name: "pending"
            },
            value: transactionData.value,
            createdAt: new Date()
        }
        return transactionEvent
    }
}