import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Donor, IDProofType } from './donor.model';
import { Col } from 'sequelize/lib/utils';
import { State } from './state.model';
import { City } from './city.model';

export enum DonationMethods {
  CASH = 'CASH',
  ONLINE = 'ONLINE',
  UPI = 'UPI',
  CHEQUE = 'CHEQUE',
  RTGS = 'RTGS',
}

@Table
export class Donation extends Model {
  @ForeignKey(() => Donor)
  @Column
  donorId: number;

  @BelongsTo(() => Donor)
  donor: Donor;

  @Column
  donationSerialNumber: string;

  @Column
  chequeOrUpiReferenceNumber: string;

  @Column
  amount: number;

  @Column
  donationDate: Date;

  @Column({
    type: DataType.ENUM(...Object.values(DonationMethods)),
    allowNull: false,
  })
  method: DonationMethods;

  @Column
  bankName: string;

  @Column
  donorFirstName: string;

  @Column
  donorLastName: string;

  @Column
  donorPhoneNumber: string;

  @Column({
    type: DataType.ENUM(...Object.values(IDProofType)),
    allowNull: true,
  })
  donorIdProofType: IDProofType;

  @Column
  donorIdProofNumber: string;

  @Column
  donorStreetAddress: string;

  @Column
  donorCustomAddress: string;

  @ForeignKey(() => State)
  @Column
  donorStateId: number;

  @BelongsTo(() => State)
  state: State;

  @ForeignKey(() => City)
  @Column
  donorCityId: number;

  @BelongsTo(() => City)
  city: City;
}
