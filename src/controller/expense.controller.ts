import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { ExpenseService } from '../services/expense.service';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  create(@Body() body: CreateExpenseDto) {
    return this.expenseService.createExpense(body);
  }
  @Get('receipt/:id')
  getReceipt(@Param() id: { id: string }) {
    return this.expenseService.generateExpenseReceipt(id.id);
  }
}
