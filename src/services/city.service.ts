import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { City } from '../models/city.model';
import { CreateCityDto } from '../dto/create-city.dto';

@Injectable()
export class CityService {
  constructor(
    @InjectModel(City)
    private readonly cityModel: typeof City,
  ) {}

  async create(dto: CreateCityDto) {
    return this.cityModel.create(dto);
  }

  async findAll() {
    return this.cityModel.findAll();
  }

  async findByState(stateId: number) {
    return this.cityModel.findAll({
      where: { stateId },
    });
  }
}
