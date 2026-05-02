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
import { State } from 'src/models/state.model';
import { City } from 'src/models/city.model';
import { DonationReceiptTemplate } from 'src/templates/donationReceipt.template';
import * as ExcelJS from 'exceljs';

@Injectable()
export class DonationService {
  constructor(
    @InjectModel(Donation) private donationModel: typeof Donation,
    @InjectModel(Donor) private donorModel: typeof Donor,
    @InjectModel(State) private stateModel: typeof State,
    @InjectModel(City) private cityModel: typeof City,
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

    const donation = await this.donationModel.create({
      donorId: dto.donorId,
      donationSerialNumber: '', // temporary, will be updated with row id
      method: dto.method,
      chequeOrUpiReferenceNumber:
        dto.method === 'CASH' ? null : dto.referenceNo,
      amount: dto.amount,
      donationDate: donationDate,
      bankName: dto.method === 'CASH' ? null : dto.bankName,
      donorFirstName: donor.dataValues.firstName,
      donorLastName: donor.dataValues.lastName,
      donorPhoneNumber: donor.dataValues.phoneNumber,
      donorIdProofType: donor.dataValues.idProofType,
      donorIdProofNumber: donor.dataValues.idProofNumber,
      donorStreetAddress: donor.dataValues.streetAddress,
      donorCustomAddress: donor.dataValues.customAddress,
      donorStateId: donor.dataValues.stateId,
      donorCityId: donor.dataValues.cityId,
    });

    // Generate serial number with row id
    const serial = `DA-${donation.id}`;
    await this.donationModel.update(
      { donationSerialNumber: serial },
      { where: { id: donation.id } },
    );

    // Fetch updated donation
    const updatedDonation = await this.donationModel.findByPk(donation.id);

    return {
      message: 'Donation Saved Successfully',
      donation: updatedDonation,
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
      isVoid,
      includeVoid,
      onlyVoid,
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

    // Enhanced void filtering logic
    if (onlyVoid === 'true' || onlyVoid === '1') {
      // Show only voided donations
      where.isVoid = true;
    } else if (includeVoid === 'true' || includeVoid === '1') {
      // Show all donations (both voided and non-voided)
      // Don't add any filter on isVoid
    } else if (isVoid !== undefined && isVoid !== null && isVoid !== '') {
      // Legacy support for isVoid parameter
      const voidValue = isVoid === 'true' || isVoid === '1';
      where.isVoid = voidValue;
    } else {
      // Default: exclude voided donations
      where.isVoid = false;
    }

    if (amountFilter) {
      if (!amount)
        throw new BadRequestException(
          'amount is required when using amountFilter',
        );

      const val = Number(amount);
      const filter = amountFilter;

      if (filter === 'lt') where.amount = { [Op.lt]: val };
      else if (filter === 'gt') where.amount = { [Op.gt]: val };
      else if (filter === 'eq') where.amount = val;
      else
        throw new BadRequestException(
          'Invalid amountFilter. Use (lt), (gt), (eq)',
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

    const res = await this.donationModel.findOne({
      where,
      include: [
        {
          model: State,
          attributes: ['id', 'name', 'Abbreviation'],
        },
        {
          model: City,
          attributes: ['id', 'name'],
        },
      ],
    });

    const result = await this.donationModel.findAndCountAll({
      where,
      limit: +pageSize,
      offset,
      order: [['donationDate', 'DESC']],
      include: [
        { model: State, attributes: ['name'] },
        { model: City, attributes: ['name'] },
      ],
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

  async getDonation(id: string | number) {
    const isId = Number(id);
    const where: any = {};
    if (!isId) {
      where.donationSerialNumber = id;
    } else {
      where.id = id;
    }
    const res = await this.donationModel.findOne({
      where,
    });
    if (!res) {
      throw new NotFoundException({
        message: 'No Donation found with id ' + id,
      });
    } else {
      const resp: any = { ...res.dataValues };
      const state = await this.stateModel.findByPk(res.donorStateId);
      const city = await this.cityModel.findByPk(res.donorCityId);
      resp.state = state;
      resp.city = city;
      return resp;
    }
  }

  async generateDonationReceipt(serialNumber: any): Promise<string> {
    const donation = await this.donationModel.findOne({
      where: {
        donationSerialNumber: serialNumber,
      },
      include: [
        {
          model: State,
          attributes: ['id', 'name'],
        },
        {
          model: City,
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!donation) {
      throw new NotFoundException(
        `Donation with serial number ${serialNumber} not found`,
      );
    }

    return DonationReceiptTemplate(donation.dataValues);
  }

  async voidDonation(serialNumber: string, reason?: string) {
    const donation = await this.donationModel.findOne({
      where: { donationSerialNumber: serialNumber },
    });

    if (!donation) {
      throw new NotFoundException(
        `Donation with serial number ${serialNumber} not found`,
      );
    }

    if (donation.dataValues.isVoid) {
      throw new BadRequestException('Donation is already voided');
    }

    try {
      await this.donationModel.update(
        {
          isVoid: true,
          voidReason: reason || 'No reason provided',
        },
        {
          where: { donationSerialNumber: serialNumber },
        },
      );
    } catch (error) {
      throw new BadRequestException(
        'Failed to void the donation: ' + error.message,
      );
    }

    return {
      success: true,
      message: 'Donation marked as void successfully',
      data: donation,
    };
  }

  async exportDonationsToExcel(filters: any): Promise<Buffer> {
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
      isVoid,
      includeVoid,
      onlyVoid,
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

    // Enhanced void filtering logic
    if (onlyVoid === 'true' || onlyVoid === '1') {
      where.isVoid = true;
    } else if (includeVoid === 'true' || includeVoid === '1') {
      // Don't add any filter on isVoid
    } else if (isVoid !== undefined && isVoid !== null && isVoid !== '') {
      const voidValue = isVoid === 'true' || isVoid === '1';
      where.isVoid = voidValue;
    } else {
      where.isVoid = false;
    }

    if (amountFilter) {
      if (!amount)
        throw new BadRequestException(
          'amount is required when using amountFilter',
        );

      const val = Number(amount);
      const filter = amountFilter;

      if (filter === 'lt') where.amount = { [Op.lt]: val };
      else if (filter === 'gt') where.amount = { [Op.gt]: val };
      else if (filter === 'eq') where.amount = val;
      else
        throw new BadRequestException(
          'Invalid amountFilter. Use (lt), (gt), (eq)',
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

    const donations = await this.donationModel.findAll({
      where,
      order: [['donationDate', 'DESC']],
      include: [
        { model: State, attributes: ['name'] },
        { model: City, attributes: ['name'] },
      ],
    });

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Donations');

    // Define columns
    worksheet.columns = [
      { header: 'Serial Number', key: 'donationSerialNumber', width: 20 },
      { header: 'Donation Date', key: 'donationDate', width: 15 },
      { header: 'First Name', key: 'donorFirstName', width: 20 },
      { header: 'Last Name', key: 'donorLastName', width: 20 },
      { header: 'Phone Number', key: 'donorPhoneNumber', width: 15 },
      { header: 'Amount', key: 'amount', width: 12 },
      { header: 'Method', key: 'method', width: 12 },
      { header: 'Bank Name', key: 'bankName', width: 20 },
      {
        header: 'Reference Number',
        key: 'chequeOrUpiReferenceNumber',
        width: 20,
      },
      { header: 'ID Proof Type', key: 'donorIdProofType', width: 15 },
      { header: 'ID Proof Number', key: 'donorIdProofNumber', width: 20 },
      { header: 'Street Address', key: 'donorStreetAddress', width: 30 },
      { header: 'Custom Address', key: 'donorCustomAddress', width: 30 },
      { header: 'State', key: 'stateName', width: 15 },
      { header: 'City', key: 'cityName', width: 15 },
      { header: 'Is Void', key: 'isVoid', width: 10 },
      { header: 'Void Reason', key: 'voidReason', width: 30 },
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' },
    };

    // Add data rows
    donations.forEach((donationVal) => {
      const donation: any = donationVal.dataValues;
      worksheet.addRow({
        donationSerialNumber: donation.donationSerialNumber,
        donationDate: donation.donationDate
          ? new Date(donation.donationDate).toLocaleDateString('en-GB')
          : '',
        donorFirstName: donation.donorFirstName,
        donorLastName: donation.donorLastName,
        donorPhoneNumber: donation.donorPhoneNumber,
        amount: donation.amount,
        method: donation.method,
        bankName: donation.bankName || '',
        chequeOrUpiReferenceNumber: donation.chequeOrUpiReferenceNumber || '',
        donorIdProofType: donation.donorIdProofType || '',
        donorIdProofNumber: donation.donorIdProofNumber || '',
        donorStreetAddress: donation.donorStreetAddress || '',
        donorCustomAddress: donation.donorCustomAddress || '',
        stateName: donation.state?.name || '',
        cityName: donation.city?.name || '',
        isVoid: donation.isVoid ? 'Yes' : 'No',
        voidReason: donation.voidReason || '',
      });
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
