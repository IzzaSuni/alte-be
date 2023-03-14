import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { main, sendRespObj } from 'src/utils/func';
import {
  createUserParams,
  loginParam,
  updatePasswordParams,
  updateUserParams,
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
    });
    const result = await userPayload.save();
    if (result) return sendRespObj(1, 'Berhasil daftar silahkan login', result);
    return sendRespObj(3, 'Maaf terjadi kesalahan', {});
  }

  async updatePassword(payload: updatePasswordParams) {
    const userFind = await this.userModel.findOne({ email: payload.email });
    if (payload.token === userFind?.resetPasswordToken) {
      return jwt.verify(
        payload.token,
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
    return sendRespObj(3, 'Maaf Token tidak valid, atau sudah digunakan', {});
  }

  async updateUser(payload: updateUserParams) {}

  async checkToken(email) {
    const userFind = await this.userModel.findOne({ email: email });
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
        .then(() => {
          return sendRespObj(
            1,
            'Link reset sudah terkirim ke email, silahkan dicek',
            {},
          );
        })
        .catch(() => sendRespObj(0, 'Maaf terjadi kesalahan', {}));
    }
    return sendRespObj(0, 'Maaf email tersebut belum terdaftar', {});
  }
}
