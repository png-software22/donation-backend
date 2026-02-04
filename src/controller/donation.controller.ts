import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Patch,
  Res,
} from '@nestjs/common';
import { DonationService } from '../services/donation.service';
import { CreateDonationDto } from '../dto/create-donation.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { VoidDonationDto } from '../dto/void-donation.dto';
import { Response } from 'express';

@Controller('donations')
@UseGuards(JwtAuthGuard)
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Post()
  async createDonation(@Body() dto: CreateDonationDto) {
    const result = await this.donationService.createDonation(dto);

    return {
      success: true,
      message: 'Donation Added Successfully',
      data: result.donation,
    };
  }

  @Get('getBySerialNumberOrId/:uniqueId')
  async getDonation(@Param('uniqueId') uniqueId: string) {
    return await this.donationService.getDonation(uniqueId);
  }

  @Get('printReceipt/:serialNumber')
  async printReceipt(@Param('serialNumber') serialNumber: string) {
    return await this.donationService.generateDonationReceipt(serialNumber);
  }

  @Get('list')
  async getDonationList(
    @Query('phone') phone: string,
    @Query('stateId') stateId: number,
    @Query('cityId') cityId: number,
    @Query('amount') amount: number,
    @Query('amountFilter') amountFilter: 'lt' | 'gt' | 'eq',
    @Query('date') date: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('method') method: string,
    @Query('isVoid') isVoid: string,
    @Query('includeVoid') includeVoid: string,
    @Query('onlyVoid') onlyVoid: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return await this.donationService.getDonationList({
      phone,
      stateId,
      cityId,
      amount,
      amountFilter,
      date,
      startDate,
      endDate,
      method,
      isVoid,
      includeVoid,
      onlyVoid,
      page,
      pageSize,
    });
  }

  @Patch('void/:serialNumber')
  async voidDonation(
    @Param('serialNumber') serialNumber: string,
    @Body() dto: VoidDonationDto,
  ) {
    return await this.donationService.voidDonation(serialNumber, dto.reason);
  }

  @Get('export/excel')
  async exportToExcel(
    @Query('phone') phone: string,
    @Query('stateId') stateId: number,
    @Query('cityId') cityId: number,
    @Query('amount') amount: number,
    @Query('amountFilter') amountFilter: 'lt' | 'gt' | 'eq',
    @Query('date') date: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('method') method: string,
    @Query('isVoid') isVoid: string,
    @Query('includeVoid') includeVoid: string,
    @Query('onlyVoid') onlyVoid: string,
    @Res() res: Response,
  ) {
    const buffer = await this.donationService.exportDonationsToExcel({
      phone,
      stateId,
      cityId,
      amount,
      amountFilter,
      date,
      startDate,
      endDate,
      method,
      isVoid,
      includeVoid,
      onlyVoid,
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=donations_${Date.now()}.xlsx`,
    );
    res.send(buffer);
  }
}
