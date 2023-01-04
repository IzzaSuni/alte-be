import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto, LoginDto } from './dtos/CreateUser.dto';
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
  async postuser(@Body() CreateUserDto: CreateUserDto, @Req() req: Request) {
    const result = await this.userService.createUser(CreateUserDto, req);
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
