import {
  Injectable,
  BadRequestException,
  StreamableFile,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Expense } from '../models/expense.model';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import puppeteer from 'puppeteer';
import { expenseHTML } from 'src/templates/expenseReceipt.template';

@Injectable()
export class ExpenseService {
  constructor(@InjectModel(Expense) private expenseModel: typeof Expense) {}

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

  async generateExpenseReceipt(serialNumber: any): Promise<StreamableFile> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const res = await this.expenseModel.findOne({
      where: {
        id: serialNumber,
      },
    });

    const page = await browser.newPage();
    const html = expenseHTML(res?.dataValues);

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' },
    });

    await browser.close();

    return new StreamableFile(pdfBuffer);
  }
}
