import {
  Column,
  Table,
  Model,
  BelongsTo,
  ForeignKey,
  AllowNull,
} from 'sequelize-typescript';
import { State } from './state.model';

interface CityCreationAttrs {
  name: string;
  abbreviation: string;
  stateId: number;
}

@Table
export class City extends Model<City, CityCreationAttrs> {
  @Column
  name: string;

  @Column
  abbreviation: string;

  @Column
  zipCode: string;

  @ForeignKey(() => State)
  @Column
  stateId!: number;

  @BelongsTo(() => State)
  state!: State;
}
