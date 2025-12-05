import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { State } from '../models/state.model';
import { CreateStateDto } from '../dto/create-state.dto';
import { Op } from 'sequelize';

@Injectable()
export class StateService {
  constructor(
    @InjectModel(State)
    private readonly stateModel: typeof State,
  ) {}

  async create(dto: CreateStateDto) {
    return this.stateModel.create(dto);
  }

  async findAll() {
    return this.stateModel.findAll();
  }
}
