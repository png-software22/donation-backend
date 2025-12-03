import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';
import { State } from './state.model';
import { City } from './city.model';

export enum IDProofType {
  ADHAAR = 'ADHAAR',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
  PASSPORT = 'PASSPORT',
  VOTER_ID = 'VOTER_ID',
}

@Table
export class User extends Model {
  @Column
  firstName: string;

  @Column
  lastName: string;

  @Unique
  @Column
  phoneNumber: string;

  @Column({
    type: DataType.ENUM(...Object.values(IDProofType)),
    allowNull: false,
  })
  idProofType: IDProofType;

  @AllowNull(false)
  @Column
  idProofNumber: string;

  @Column
  streetAddress: string;

  @ForeignKey(() => State)
  @Column
  stateId: number;

  @ForeignKey(() => City)
  @Column
  cityId: number;

  @BelongsTo(() => State)
  state!: State;

  @BelongsTo(() => City)
  city!: City;
}
