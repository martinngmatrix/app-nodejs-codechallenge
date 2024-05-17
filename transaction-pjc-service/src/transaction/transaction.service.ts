import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '../kafka/consumer.service';
import { TransactionEvent } from './resources/transaction.event';
import { Transaction } from './transaction.model';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class TransactionService implements OnModuleInit {
  constructor(private prisma : PrismaService, private readonly consumerService: ConsumerService) {}

  async onModuleInit() {
    await this.consumerService.consume(
      { topics: ['transaction.rejected.topic', 'transaction.approved.topic'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            value: message.value.toString(),
            topic: topic.toString(),
            partition: partition.toString(),
          });
          const eventParsed : TransactionEvent = JSON.parse(message.value.toString())
          await this.updateTransaction(eventParsed)
        }
      },
    );
  }

  async updateTransaction(transactionData : TransactionEvent) : Promise<Transaction> {
    const transactionDataCopy = {
      ...transactionData
    }
    delete transactionDataCopy.accountExternalIdCredit
    delete transactionDataCopy.accountExternalIdDebit
      return this.prisma.transaction.update({
          where: {accountExternalIdDebit : transactionData.accountExternalIdDebit, accountExternalIdCredit : transactionData.accountExternalIdCredit},
          data: {data: JSON.stringify(transactionDataCopy)}
      })
  }
}
