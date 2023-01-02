import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { main, sendRespObj, validation } from 'src/utils/func';
import {
  createUserParams,
  loginParam,
  updatePasswordParams,
} from 'src/utils/types';
import { User } from './user.model';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  constructor(@InjectModel('user') private readonly userModel: Model<User>) {}

  async getUser() {
    const result = await this.userModel.find().exec();
    return result;
  }

  async createUser(payload: createUserParams) {
    const userFind = await this.getUser();
    const find = userFind.find((e) => e.email === payload.email);
    if (find) {
      return sendRespObj(2, 'Maaf email sudah terdaftar', {});
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(payload.password, salt);
    payload.password = hash;
    const userPayload = new this.userModel({
      ...payload,
      created_at: new Date(),
      resetPasswordToken: null,
    });
    const result = await userPayload.save();
    if (result) return sendRespObj(1, 'Berhasil daftar silahkan login', result);
    return sendRespObj(3, 'Maaf terjadi kesalahan', {});
  }
  async updatePassword(payload: updatePasswordParams) {
    const userFind = await this.userModel.findOne({ email: payload.email });
    if (userFind) {
      return jwt.verify(
        userFind.resetPasswordToken,
        process.env.EMAIL_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) {
            userFind.resetPasswordToken = null;
            await userFind.save();
            return sendRespObj(2, 'Maaf tidak valid', {});
          }
          if (decoded) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(payload.password, salt);
            userFind.password = hash;
            userFind.resetPasswordToken = null;
            userFind.save();
            return sendRespObj(1, 'Berhasil merubah password', {});
          }
        },
      );
    }
    return sendRespObj(3, 'Maaf terjadi kesalahan', {});
  }

  async checkToken(email) {
    const userFind = await this.userModel.findOne({ email: email });
    console.log(userFind);
    if (userFind.resetPasswordToken) {
      return jwt.verify(
        userFind.resetPasswordToken,
        process.env.EMAIL_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) {
            userFind.resetPasswordToken = null;
            await userFind.save();
            return sendRespObj(2, 'Token sudah tidak valid', {});
          }
          if (decoded) {
            return sendRespObj(1, 'Token masih Valid', {});
          }
        },
      );
    }
    return sendRespObj(0, 'Token Tidak Ada', {});
  }

  async login(payload: loginParam, res) {
    const userFind = await this.userModel.findOne({ email: payload.email });
    if (userFind) {
      const valid = bcrypt.compareSync(payload.password, userFind.password);
      if (valid) {
        const accesToken = jwt.sign(
          {
            fullname: userFind.fullname,
            email: userFind.email,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '12h' },
        );
        res.cookie('accesToken', accesToken, {
          maxAge: 12 * 60 * 60 * 1000,
        });
        return sendRespObj(1, 'Sukses Login', accesToken);
      }
      return sendRespObj(2, 'email atau password salah', {});
    }
    return sendRespObj(0, 'email tidak terdaftar', {});
  }

  async sendEmail(to) {
    const userFind = await this.userModel.findOne({ email: to });
    if (userFind) {
      const emailToken = jwt.sign(
        {
          email: userFind.email,
        },
        process.env.EMAIL_TOKEN_SECRET,
        { expiresIn: '1h' },
      );
      userFind.resetPasswordToken = emailToken;
      await userFind.save();
      return await main('silahkan akses link berikut', emailToken, to)
        .then((e) => {
          return sendRespObj(
            1,
            'Link reset sudah terkirim ke email, silahkan dicek',
            {},
          );
        })
        .catch((err) => sendRespObj(0, 'Maaf terjadi kesalahan', {}));
    }
    return sendRespObj(0, 'Maaf email tersebut belum terdaftar', {});
  }
}
