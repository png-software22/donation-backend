import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Expense extends Model {
  @Column
  expenseName: string;

  @Column(DataType.TEXT)
  expenseDescription: string;

  @Column(DataType.BIGINT)
  expenseAmount: number;
}
