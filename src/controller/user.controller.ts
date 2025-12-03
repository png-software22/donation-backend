import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { UserService } from 'src/services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  createUser(@Body() user: CreateUserDTO) {
    return this.userService.createUser(user);
  }

  @Get()
  getAllUser() {
    return this.userService.getAllUsers();
  }
}
