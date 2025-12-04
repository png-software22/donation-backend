import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { City } from 'src/models/city.model';
import { State } from 'src/models/state.model';
import { User } from 'src/models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(City) 
    private readonly cityModel: typeof City,
    @InjectModel(State)
    private readonly stateModel: typeof State,
  ) {}

  async createUser(user: CreateUserDTO) {

    const existingUser = await this.userModel.findOne({
      where: { phoneNumber: user.phoneNumber },
    });

    if (existingUser) {
      throw new BadRequestException('Phone number already exists');
    }

    const state = await this.stateModel.findByPk(user.stateId);
    if (!state) {
      throw new BadRequestException(`Invalid stateId`);
    }

    const city = await this.cityModel.findOne({
      where: { id: user.cityId, stateId: user.stateId },
    });

    if (!city) {
      throw new BadRequestException(
        `City with id ${user.cityId} does not belong to state ${user.stateId}`,
      );
    }

    return this.userModel.create(user as any);
  }

  async getAllUsers() {
    return this.userModel.findAll({
      include: { all: true },
    });
  }
}
