import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  forgotPasswordTemplate,
  generateCode,
  sendRespObj,
} from 'src/utils/func';
import {
  createUserParams,
  loginParam,
  updatePasswordParams,
} from 'src/utils/types';
import { User } from './user.model';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel('user') private readonly userModel: Model<User>) {}

  async createUser(payload: createUserParams) {
    // if (req.headers.origin !== 'https://alte.vercel.app')
    //   return sendRespObj(10, 'HMMM no no no', {});
    const userFind = await this.userModel.findOne({ email: payload.email });
    const findAll = await this.userModel.find();
    const length = findAll.length;
    if (userFind) {
      return sendRespObj(2, 'Maaf email sudah terdaftar', {});
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(payload.password, salt);
    payload.password = hash;
    const userPayload = new this.userModel({
      ...payload,
      created_at: new Date(),
      resetPasswordToken: null,
      finger_id: length + 1,
      is_finger_registered: false,
      role: { main: payload.role },
    });
    const result = await userPayload.save();
    if (result) return sendRespObj(1, 'Berhasil daftar silahkan login', result);
    return sendRespObj(3, 'Maaf terjadi kesalahan', {});
  }

  async updatePassword(payload: updatePasswordParams) {
    const userFind = await this.userModel.findOne({ email: payload.email });
    if (payload.token === userFind?.resetPasswordToken) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(payload.password, salt);
      userFind.password = hash;
      userFind.resetPasswordToken = null;
      userFind.resetTry = 0;
      userFind.save();
      return sendRespObj(1, 'Berhasil merubah password');
    }
    return sendRespObj(0, 'Maaf Token tidak valid, atau sudah digunakan');
  }

  async checkToken(email) {
    const userFind = await this.userModel.findOne({ email: email });
    if (userFind?.resetPasswordToken) {
      return sendRespObj(1, 'Token sudah dikirim sebelumnya');
    }
    return sendRespObj(0, 'Token akan dikirim');
  }

  async verifyToken({ email, token }) {
    const userFind = await this.userModel.findOne({ email: email });
    if (userFind) {
      if (userFind?.resetPasswordToken === token)
        return sendRespObj(1, 'Token Valid silahkan masukan password baru');
      const curretTryReset = userFind?.resetTry;
      const newTryReset = curretTryReset - 1;
      if (curretTryReset === 0) {
        userFind.resetPasswordToken = null;
        await userFind.save();
        return sendRespObj(0, `Silahkan request token baru`);
      }
      userFind.resetTry = newTryReset;
      await userFind.save();
      return sendRespObj(
        0,
        `Token Salah anda memiliki ${newTryReset} kesempatan`,
      );
    }
    return sendRespObj(0, `Email tidak ditemukan`);
  }

  async login(payload: loginParam) {
    const userFind = await this.userModel.findOne({ email: payload.email });
    if (userFind) {
      const valid = bcrypt.compareSync(payload.password, userFind.password);

      const jwtReturnVal = {
        fullname: userFind.fullname,
        email: userFind.email,
        id: userFind._id,
        profile: userFind?.profile,
        role: userFind?.role,
      };
      const jwtSecret = process.env.ACCESS_TOKEN_SECRET;
      const jwtConfig = {
        expiresIn: '12h',
      };

      if (valid) {
        const accesToken = jwt.sign(jwtReturnVal, jwtSecret, jwtConfig);
        return sendRespObj(1, 'Sukses Login', accesToken);
      }
      return sendRespObj(2, 'email atau password salah', {});
    }
    return sendRespObj(0, 'email tidak terdaftar', {});
  }

  async sendEmail(email) {
    const userFind = await this.userModel.findOne({ email: email });
    if (userFind) {
      const code = generateCode();
      userFind.resetPasswordToken = code;
      await userFind.save();
      return await forgotPasswordTemplate(email, code)
        .then(async () => {
          userFind.resetTry = 3;
          await userFind.save();
          return sendRespObj(
            1,
            'Link reset sudah terkirim ke email, silahkan dicek',
            {},
          );
        })
        .catch((err) => sendRespObj(0, 'Maaf terjadi kesalahan', err));
    }
    return sendRespObj(0, 'Maaf email tersebut belum terdaftar', {});
  }
}
