import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column
  userName: string;

  @Column(DataType.TEXT)
  password: string;

  @Column
  name: string;
}
