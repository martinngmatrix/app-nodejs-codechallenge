import { Controller, Get, Query} from "@nestjs/common";
import { TransactionEvent } from "./resources/transaction.event";
import { TransactionService } from "./transaction.service";

@Controller('api/v1/transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService){}

    @Get()
    async postTransaction(@Query('debitId') debitId: string, @Query('creditId') creditId: string):Promise<TransactionEvent>{
        return this.transactionService.getTransaction(debitId, creditId)
    }
}