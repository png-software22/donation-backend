import { Column, Table, Model, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { State } from './state.model';

@Table
export class City extends Model {
  @Column
  name: string;

  @Column
  abbreviation: string;

  @ForeignKey(() => State)
  @Column
  stateId!: number;

  @BelongsTo(() => State)
  state!: State;
}
