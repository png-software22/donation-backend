import { Body, Controller, Post } from "@nestjs/common";
import { CreateDonationDto } from "../dto/create-donation.dto"
import { DonationService } from "../services/donation.service";

@Controller("donations")
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Post()
  create(@Body() dto: CreateDonationDto) {
    return this.donationService.createDonation(dto);
  }
}
