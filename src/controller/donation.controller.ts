import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DonationService } from '../services/donation.service';
import { CreateDonationDto } from '../dto/create-donation.dto';

@Controller('donations')
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
      page,
      pageSize,
    });
  }
}
