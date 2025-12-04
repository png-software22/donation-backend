import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { City } from '../models/city.model';
import { CreateCityDto } from '../dto/create-city.dto';
import { State } from '../models/state.model';

@Injectable()
export class CityService {
  constructor(
    @InjectModel(City)
    private readonly cityModel: typeof City,

    @InjectModel(State)
    private readonly stateModel: typeof State,
  ) {}

  async create(dto: CreateCityDto) {
   
    const state = await this.stateModel.findByPk(dto.stateId);
    if (!state) {
      throw new BadRequestException(`Invalid stateId`);
    }

    const existing = await this.cityModel.findOne({
      where: { name: dto.name, stateId: dto.stateId },
    });

    if (existing) {
      throw new BadRequestException(
  `City '${dto.name}' already exists in state '${state?.name ?? "selected"}'`,
      );
    }

    return this.cityModel.create(dto as any);
  }

  async findAll() {
    return this.cityModel.findAll({ include: { all: true } });
  }

  async findByState(stateId: number) {
    return this.cityModel.findAll({
      where: { stateId },
    });
  }
}
