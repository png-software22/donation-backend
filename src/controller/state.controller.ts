import { Controller, Post, Body, Get } from '@nestjs/common';
import { StateService } from '../services/state.service';
import { CreateStateDto } from '../dto/create-state.dto';

@Controller('states')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Post()
  create(@Body() dto: CreateStateDto) {
    return this.stateService.create(dto);
  }

  @Get()
  getAll() {
    return this.stateService.findAll();
  }
}
