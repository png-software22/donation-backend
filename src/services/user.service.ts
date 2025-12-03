import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { State } from 'src/models/state.model';
import { User } from 'src/models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async createUser(user: CreateUserDTO) {
    return this.userModel.create(user as any);
  }
  async getAllUsers() {
    return this.userModel.findAll({
        include: {all:true}
    });
  }
}
