// @ts-nocheck
import * as google from 'googleapis';
import * as jwt from 'jsonwebtoken';
const nodemailer = require('nodemailer');
export const credentials = {
  CLIENT_ID:
    '474346708682-ku0gss3abqvlr8eg0rp9iqn2j2ove2fa.apps.googleusercontent.com',
  REFRESH_TOKEN:
    '1//04xeDWmX_mc5xCgYIARAAGAQSNwF-L9Irlgby9ZHrtzthCYgb8awFtlW3759GCwaYjaXi5oxpPyw_Ek7rIpq-8xU7sMX-Kv1mkJw',
  REDIRECT_URI: 'https://developers.google.com/oauthplayground',
  CLIENT_SECRET: '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',
};

export const validation = (email: any) => {
  let isDomainValid = false;
  const domain = email.slice(email.indexOf('@') + 1, email.length);
  const nim = email.slice(email.indexOf('.') + 1, email.indexOf('@'));
  const allowedDomain = 'itera.ac.id';
  let angkatan = `20${nim[1]}${nim[2]}`;
  const isElektro = Number(nim.slice(3, 6)) === 130;

  if (domain.includes(allowedDomain)) {
    isDomainValid = true;
  }
  return { isDomainValid, isElektro, angkatan, nim };
};

export const jwtVerifySecret = (jwts: string) => {
  let valid = null;
  jwt.verify(jwts, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) valid = false;
    if (decoded) valid = true;
  });
  return { valid };
};

export const sendRespObj = (code: number, message: string, result: object) => {
  return {
    status: code === 1 ? 'success' : 'error',
    code,
    data: { message, result },
  };
};

export const main = async (message: any, token: any, to: string) => {
  const options = {
    from: 'ALTE_App <kmitera.cms@gmail.com>',
    to: to,
    subject: 'Forgot Password reset link',
    text: 'email test from alte app',
    html: `<div><h5>Harap jangan berikan link ini kesiapapun</h5>
    <h6>Jika anda tidak merequest akses reset password, abaikan pesan ini</h6>
    <p>lupa password ya?👀, ${message}, <br/>link: https://alte.vercel.app/forgot-password?token=${token}</p></div>`,
  };

  const oAuth2Client = new google.Auth.OAuth2Client(
    credentials.CLIENT_ID,
    credentials.CLIENT_SECRET,
    credentials.REDIRECT_URI,
  );
  oAuth2Client.setCredentials({ refresh_token: credentials.REFRESH_TOKEN });

  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'kmitera.cms@gmail.com',
        clientId: credentials.CLIENT_ID,
        clientSecret: credentials.CLIENT_SECRET,
        refreshToken: credentials.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    const result = await transport.sendMail(options);
    return result;
  } catch (err) {
    console.log(err);
  }
};
