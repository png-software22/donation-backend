import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { UserDTO } from 'src/dto/create-user';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private jwtService: JwtService,
  ) {}

  async createUser(body: UserDTO) {
    if (!body.userName || !body.name || !body.password) {
      throw new BadRequestException('Invalid user data');
    }
    const existingUser = await this.userModel.findOne({
      where: { userName: body.userName },
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await this.userModel.create({
      ...body,
      password: hashedPassword,
    });
    const { password, ...safeUser } = user.get({ plain: true });
    return safeUser;
  }
  async loginUser(userDetails: { userName: string; password: string }) {
    const user = await this.userModel.findOne({
      where: {
        userName: userDetails.userName,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid userName');
    }
    const isPasswordValid = await bcrypt.compare(
      userDetails.password,
      user.get('password'),
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      sub: user.id,
      email: user.userName,
      role: ['super'],
    };

    return {
      accessToken: this.jwtService.sign(payload),
      userName: user.get('userName'),
      name: user.get('name'),
    };
  }
}
