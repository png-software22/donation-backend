import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateDonorDTO } from 'src/dto/create-donor.dto';
import { City } from 'src/models/city.model';
import { State } from 'src/models/state.model';
import { Donor } from 'src/models/donor.model';

@Injectable()
export class DonorService {
  constructor(
    @InjectModel(Donor)
    private readonly donorModel: typeof Donor,
    @InjectModel(City)
    private readonly cityModel: typeof City,
    @InjectModel(State)
    private readonly stateModel: typeof State,
  ) {}

  async createDonor(donor: CreateDonorDTO) {
    const existingDonor = await this.donorModel.findOne({
      where: { phoneNumber: donor.phoneNumber },
    });

    if (existingDonor) {
      throw new BadRequestException('Phone number already exists');
    }

    const state = await this.stateModel.findByPk(donor.stateId);
    if (!state) {
      throw new BadRequestException(`Invalid stateId`);
    }

    const city = await this.cityModel.findOne({
      where: { id: donor.cityId, stateId: donor.stateId },
    });

    if (!city) {
      throw new BadRequestException(
        `City with id ${donor.cityId} does not belong to state ${donor.stateId}`,
      );
    }

    return this.donorModel.create(donor as any);
  }

  async getAllDonors() {
    return this.donorModel.findAll({
      include: { all: true },
    });
  }
}
