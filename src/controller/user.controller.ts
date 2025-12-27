import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import type { UserDTO } from 'src/dto/create-user';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  create(@Body() body: UserDTO) {
    return this.userService.createUser(body);
  }
  @Post('login')
  getUser(@Body() body: { userName: string; password: string }) {
    return this.userService.loginUser(body);
  }
}
