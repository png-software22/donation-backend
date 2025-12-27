import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { CityService } from '../services/city.service';
import { CreateCityDto } from '../dto/create-city.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateCityDto) {
    return this.cityService.create(dto);
  }

  @Get(':stateId')
  getCitiesByState(@Param('stateId') stateId: string) {
    return this.cityService.findByState(Number(stateId));
  }
}
