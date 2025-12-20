import {
  Injectable,
  BadRequestException,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Donation } from '../models/donation.model';
import { CreateDonationDto } from '../dto/create-donation.dto';
import { Donor } from '../models/donor.model';
import { literal, Op } from 'sequelize';
import { State } from 'src/models/state.model';
import { City } from 'src/models/city.model';
import puppeteer from 'puppeteer';
import { DonationReceiptTemplate } from 'src/templates/donationReceipt.template';

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
      limit: pageSize,
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
  async generateDonationReceipt(serialNumber: any): Promise<StreamableFile> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const res = await this.donationModel.findOne({
      where: {
        donationSerialNumber: serialNumber,
      },
    });
    const page = await browser.newPage();
    const html = DonationReceiptTemplate(res?.dataValues);

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' },
    });

    await browser.close();

    return new StreamableFile(pdfBuffer);
  }
}
