import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateUserDto, LoginDto } from './dtos/CreateUser.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userServices: UserService) {}

  @Get('check-token')
  async checkToken(@Query('email') toemail) {
    const result = await this.userServices.checkToken(toemail);
    return result;
  }

  @Post('verify-token')
  async verifyToken(@Body() data: { email: string; token: string }) {
    const result = await this.userServices.verifyToken(data);
    return result;
  }

  @Post()
  async postUser(@Body() CreateUserDtos: CreateUserDto) {
    const result = await this.userServices.createUser(CreateUserDtos);
    return result;
  }
  @Post('forgot')
  async updatePassword(@Body() LoginDtos: LoginDto) {
    const result = await this.userServices.updatePassword(LoginDtos);
    return result;
  }
}

@Controller('login')
export class Login {
  constructor(private userServices: UserService) {}
  @Post()
  async login(@Body() LoginDtos: LoginDto) {
    const result = await this.userServices.login(LoginDtos);
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
