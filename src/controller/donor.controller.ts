import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateDonorDTO } from 'src/dto/create-donor.dto';
import { DonorService } from 'src/services/donor.service';

@Controller('donors')
export class DonorController {
  constructor(private readonly DonorService: DonorService) {}
  @Post()
  createDonor(@Body() donor: CreateDonorDTO) {
    return this.DonorService.createDonor(donor);
  }

  @Get()
  getAllDonor() {
    return this.DonorService.getAllDonors();
  }
}
