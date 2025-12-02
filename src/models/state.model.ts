import { Column, HasMany, Table, Model } from 'sequelize-typescript';
import { City } from './city.model';

@Table
export class State extends Model {
  @Column
  name: string;

  @Column
  Abbreviation: string;

  @HasMany(() => City)
  cities: City[];
}
