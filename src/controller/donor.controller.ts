import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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

  // ?donors/search?filterBy=phoneNumber&value=8950848075
  // ?donors/search?filterBy=idProofNumber&value=1231231
  // filter by are allowed with phoneNumber & idProofNumber
  @Get('search')
  searchDonors(@Query('filterBy') filterBy:string , @Query('value') value: string) {
    return this.DonorService.searchWithFilter(filterBy, value);
  }
}
