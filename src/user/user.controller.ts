import { MailerService } from '@nestjs-modules/mailer';
import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { main } from 'src/utils/func';
import { CreateUserDto, LoginDto } from './dtos/CreateUser.dto';
import { UserService } from './user.service';
const sgMail = require('@sendgrid/mail');

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUser() {
    const result = await this.userService.getUser();
    return result;
  }
  @Get('check-token')
  async checkToken(@Query('email') toemail) {
    const result = await this.userService.checkToken(toemail);
    return result;
  }
  @Post()
  async postuser(@Body() CreateUserDto: CreateUserDto) {
    const result = await this.userService.createUser(CreateUserDto);
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
  async login(
    @Body() LoginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.userService.login(LoginDto, response);
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
