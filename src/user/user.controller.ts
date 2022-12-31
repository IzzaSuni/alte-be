import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto, LoginDto } from './dtos/CreateUser.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUser() {
    const result = await this.userService.getUser();
    return result;
  }
  @Post()
  async postuser(@Body() CreateUserDto: CreateUserDto) {
    const result = await this.userService.createUser(CreateUserDto);
    return result;
  }
}
@Controller('login')
export class login {
  constructor(private userService: UserService) {}
  @Post()
  async login(
    @Body() LoginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.userService.login(LoginDto, response);
    return result;
  }
}
