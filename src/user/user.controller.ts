import { Body, Controller, Get, Post, Query, Put } from '@nestjs/common';
import { CreateUserDto, LoginDto, UpdateUserDto } from './dtos/CreateUser.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('check-token')
  async checkToken(@Query('email') toemail) {
    const result = await this.userService.checkToken(toemail);
    return result;
  }
  @Post()
  async postUser(@Body() CreateUserDto: CreateUserDto) {
    const result = await this.userService.createUser(CreateUserDto);
    return result;
  }
  @Put()
  async updateUser(@Body() UpdateUserDto: UpdateUserDto) {
    const result = await this.userService.updateUser(UpdateUserDto);
    return result;
  }
  @Post('forgot')
  async updatePassword(@Body() LoginDto: LoginDto) {
    const result = await this.userService.updatePassword(LoginDto);
    return result;
  }
}

@Controller('login')
export class Login {
  constructor(private userService: UserService) {}
  @Post()
  async login(@Body() LoginDto: LoginDto) {
    console.log(LoginDto);
    const result = await this.userService.login(LoginDto);
    return result;
  }
}

@Controller('email')
export class Email {
  constructor(private mailerService: UserService) {}
  @Get()
  async Email(@Query('to') toemail) {
    return this.mailerService.sendEmail(toemail);
  }
}
