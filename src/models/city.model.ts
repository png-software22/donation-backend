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
  zipCode: string;
  stateId: number;
}

@Table({
   timestamps: false, 
  tableName: "Cities",
  indexes: [
    {
      unique: true,
      fields: ['name', 'stateId'], // same city name twice in same state not allowed
    },
  ],
})
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
