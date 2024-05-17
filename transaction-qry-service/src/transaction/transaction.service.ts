import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { TransactionEvent } from "./resources/transaction.event";

@Injectable()
export class TransactionService {
    constructor(private prisma : PrismaService) {}

    async getTransaction(accountExternalIdDebit: string, accountExternalIdCredit: string): Promise<TransactionEvent>{
        const response = await this.prisma.transaction.findUnique({where: {accountExternalIdDebit : accountExternalIdDebit, accountExternalIdCredit : accountExternalIdCredit}})
        return JSON.parse(response.data)
    }
}