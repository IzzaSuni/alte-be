import { MailerService } from '@nestjs-modules/mailer';
import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import e, { Response } from 'express';
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
  constructor(private mailerService: MailerService) {}
  @Get()
  async Email(@Query('to') toemail) {
    console.log(toemail);
    await this.mailerService
      .sendMail({
        to: toemail,
        from: 'akbarizza09@gmail.com',
        subject: 'halo',
        text: 'oke',
      })
      .then((e) => console.log(e))
      .catch((err) => console.log(err));
    return 'oke';
  }
}
