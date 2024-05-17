import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '../kafka/consumer.service';
import { TransactionEvent } from './resources/transaction.event';
import { ProducerService } from 'src/kafka/producer.service';

@Injectable()
export class AntiFraudService implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private producer: ProducerService,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      { topics: ['transaction.pending.topic'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const eventValidated = this.validateAmount(
            JSON.parse(message.value.toString()),
          );
          await this.publishTransaction(eventValidated);
          console.log({
            value: message.value.toString(),
            topic: topic.toString(),
            partition: partition.toString(),
          });
        },
      },
    );
  }
  private validateAmount(transactionEvent: TransactionEvent) {
    transactionEvent.transactionStatus.name = 'approved';
    if (transactionEvent.value > 1000) {
      transactionEvent.transactionStatus.name = 'rejected';
    }
    return transactionEvent;
  }
  private async publishTransaction(data: TransactionEvent) {
    const event = {
      topic: 'transaction.approved.topic',
      messages: [
        {
          value: JSON.stringify(data),
        },
      ],
    };
    if (data.transactionStatus.name == 'rejected')
      event.topic = 'transaction.rejected.topic';
    await this.producer.produce(event);
  }
}
