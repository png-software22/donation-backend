import { Column, HasMany, Table, Model } from 'sequelize-typescript';
import { City } from './city.model';

export interface StateCreationAttrs {
  name: string;
  Abbreviation: string;
}


@Table({
  timestamps: false,   
  tableName: "States"  
})
export class State extends Model<State, StateCreationAttrs>  {
  @Column
  name: string;

  @Column
  Abbreviation: string;

  @HasMany(() => City)
  cities: City[];
}
