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

export enum DonationMethods {
  CASH = 'CASH',
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
  donationSerialNumber: string; // auto calculate

  @Column
  chequeOrUpiReferenceNumber: string;

  @Column
  amount: number;

  @Column
  donationDate: Date; // only if back date is allowed

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

  @Column
  donorStateId: number;

  @Column
  donorCityId: number;
}
