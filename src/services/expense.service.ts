import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Expense } from '../models/expense.model';
import { CreateExpenseDto } from '../dto/create-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense) private expenseModel: typeof Expense,
  ) {}

  async createExpense(body: CreateExpenseDto) {
    if (
      !body.expenseName ||
      !body.expenseDescription ||
      !body.expenseAmount ||
      body.expenseAmount <= 0
    ) {
      throw new BadRequestException('Invalid expense data');
    }

    return this.expenseModel.create({
      expenseName: body.expenseName,
      expenseDescription: body.expenseDescription,
      expenseAmount: body.expenseAmount,
    });
  }
}
