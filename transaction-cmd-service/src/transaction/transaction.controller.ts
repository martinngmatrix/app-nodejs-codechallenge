import { Body, Controller, Post} from "@nestjs/common";
import { TransactionInput } from "./resources/transaction.input";
import { TransactionEvent } from "./resources/transaction.event";
import { TransactionService } from "./transaction.service";

@Controller('api/v1/transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService){}

    @Post()
    async postTransaction(@Body() postData: TransactionInput):Promise<TransactionEvent>{
        return this.transactionService.createTransaction(postData)
    }
}