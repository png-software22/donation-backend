import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { StateService } from '../services/state.service';
import { CreateStateDto } from '../dto/create-state.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Controller('states')
@UseGuards(JwtAuthGuard)
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
