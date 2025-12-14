import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Donation } from '../models/donation.model';
import { CreateDonationDto } from '../dto/create-donation.dto';
import { Donor } from '../models/donor.model';
import { Op } from 'sequelize';

@Injectable()
export class DonationService {
  constructor(
    @InjectModel(Donation) private donationModel: typeof Donation,
    @InjectModel(Donor) private donorModel: typeof Donor,
  ) {}

  async createDonation(dto: CreateDonationDto) {
    const donor = await this.donorModel.findByPk(dto.donorId);

    if (!donor) throw new NotFoundException('Donor not found');
    if (!dto.date) throw new BadRequestException('Donation date is required');
    if (!this.isValidDDMMYYYY(dto.date))
      throw new BadRequestException('Invalid date format. Use DD-MM-YYYY');
    if (!dto.amount || dto.amount <= 0)
      throw new BadRequestException('Amount must be greater than 0');

    const donationDate = this.parseDateStart(dto.date!);
    const serial = 'DN-' + Date.now();

    const donation = await this.donationModel.create({
      donorId: dto.donorId,
      donationSerialNumber: serial,
      method: dto.method,
      chequeOrUpiReferenceNumber:
        dto.method === 'CASH' ? null : dto.referenceNo,
      amount: dto.amount,
      donationDate: donationDate,
      bankName: dto.method === 'CASH' ? null : dto.bankName,
      donorFirstName: donor.firstName,
      donorLastName: donor.lastName,
      donorPhoneNumber: donor.phoneNumber,
      donorIdProofType: donor.idProofType,
      donorIdProofNumber: donor.idProofNumber,
      donorStreetAddress: donor.streetAddress,
      donorCustomAddress: donor.customAddress,
      donorStateId: donor.stateId,
      donorCityId: donor.cityId,
    });

    return {
      message: 'Donation Saved Successfully',
      donation,
    };
  }

  async getDonationList(filters: any) {
    const {
      phone,
      stateId,
      cityId,
      method,
      amount,
      amountFilter,
      date,
      startDate,
      endDate,
      page = 1,
      pageSize = 10,
    } = filters;

    const where: any = {};

    if (amount && isNaN(Number(amount)))
      throw new BadRequestException('Amount must be a valid number');
    if (phone && phone.length < 8)
      throw new BadRequestException('Invalid phone number');

    if (phone) where.donorPhoneNumber = phone;
    if (stateId) where.donorStateId = stateId;
    if (cityId) where.donorCityId = cityId;
    if (method) where.method = method;

    if (amountFilter) {
      if (!amount)
        throw new BadRequestException(
          'amount is required when using amountFilter',
        );

      const val = Number(amount);
      const filter = Number(amountFilter);

      if (filter === 1) where.amount = { [Op.lt]: val };
      else if (filter === 2) where.amount = { [Op.gt]: val };
      else if (filter === 3) where.amount = val;
      else
        throw new BadRequestException(
          'Invalid amountFilter. Use 1 (lt), 2 (gt), 3 (eq)',
        );
    }
    if (date && !this.isValidDDMMYYYY(date))
      throw new BadRequestException('Invalid date format. Use DD-MM-YYYY');
    if (startDate && !this.isValidDDMMYYYY(startDate))
      throw new BadRequestException('Invalid startDate format. Use DD-MM-YYYY');
    if (endDate && !this.isValidDDMMYYYY(endDate))
      throw new BadRequestException('Invalid endDate format. Use DD-MM-YYYY');

    if (date) {
      const s = this.parseDateStart(date);
      const e = this.parseDateEnd(date);
      where.donationDate = { [Op.between]: [s, e] };
    }

    if (startDate && endDate) {
      const s = this.parseDateStart(startDate);
      const e = this.parseDateEnd(endDate);
      if (s > e)
        throw new BadRequestException(
          'startDate cannot be greater than endDate',
        );
      where.donationDate = { [Op.between]: [s, e] };
    }

    const offset = (page - 1) * pageSize;

    const result = await this.donationModel.findAndCountAll({
      where,
      limit: pageSize,
      offset,
      order: [['donationDate', 'DESC']],
    });

    return {
      success: true,
      total: result.count,
      currentPage: page,
      pageSize,
      data: result.rows,
    };
  }

  private isValidDDMMYYYY(d: string): boolean {
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    if (!regex.test(d)) return false;
    const [day, month, year] = d.split('-').map(Number);
    return (
      day >= 1 &&
      day <= 31 &&
      month >= 1 &&
      month <= 12 &&
      year >= 1900 &&
      year <= 2100
    );
  }

  private parseDateStart(d: string): Date {
    const [day, month, year] = d.split('-');
    return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  }

  private parseDateEnd(d: string): Date {
    const [day, month, year] = d.split('-');
    return new Date(`${year}-${month}-${day}T23:59:59.999Z`);
  }
}
