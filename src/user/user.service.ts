import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sendRespObj, validation } from 'src/utils/func';
import { createUserParams, loginParam } from 'src/utils/types';
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
    const { isDomainValid, isElektro, angkatan, nim } = validation(
      payload.email,
    );

    if (isDomainValid && isElektro) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(payload.password, salt);
      payload.password = hash;
      const userPayload = new this.userModel({
        ...payload,
        angkatan: angkatan,
        nim: nim,
        created_at: new Date(),
        role: null,
        finger_id: null,
      });
      const result = await userPayload.save();
      if (result)
        return sendRespObj(1, 'Berhasil daftar silahkan login', result);
      return sendRespObj(3, 'Maaf terjadi kesalahan', {});
    } else {
      let message = '';
      if (!isDomainValid) message = 'maaf hanya menerima domain itera';
      if (!isElektro) message = 'maaf anda bukan mahasiswa elektro';
      return sendRespObj(3, message, {});
    }
  }

  async login(payload: loginParam, res) {
    const userFind = await this.getUser();
    const find = userFind.find((e) => e.email === payload.email);
    if (find) {
      const valid = bcrypt.compareSync(payload.password, find.password);
      if (valid) {
        const accesToken = jwt.sign(
          {
            fullname: find.fullname,
            email: find.email,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '12h' },
        );
        res.cookie('accessToken', accesToken, {
          maxAge: 12 * 60 * 60 * 1000,
          httpOnly: true,
        });
        return { status: 'success', code: 1, accesToken };
      }
      return { status: 'error', code: 2, message: 'email atau password salah' };
    }
    return {
      status: 'error',
      code: 0,
      message: 'email tidak ditemukan',
    };
  }
}
