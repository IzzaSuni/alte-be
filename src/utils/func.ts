import * as google from 'googleapis';
import * as jwt from 'jsonwebtoken';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');

export const credentials: any = {
  CLIENT_ID:
    '547480458217-qhei8q3hjnii3rr6utpbrogqt7nqr5le.apps.googleusercontent.com',
  REFRESH_TOKEN:
    '1//04uLhUeWIKShVCgYIARAAGAQSNwF-L9IrUaLIa5c81EizyjOUznm7BYhIeTM8J_-anCMmbS-VkX8pOLqv3NXqRja7WhTKFtKKPk0',
  REDIRECT_URI: 'https://developers.google.com/oauthplayground',
  CLIENT_SECRET: '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',
};

export const validation = (email: string) => {
  const domain = email.slice(email.indexOf('@') + 1, email.length);
  const nim = email.slice(email.indexOf('.') + 1, email.indexOf('@'));
  const isPraktikan = 'student.itera.ac.id' === domain;
  const isDosen = 'el.itera.ac.id' === domain;
  const isStaff = 'staff.itera.ac.id' === domain;

  const validDomain = isPraktikan || isDosen || isStaff;
  const angkatan = `20${nim[1]}${nim[2]}`;
  const isElektro = Number(nim.slice(3, 6)) === 130;

  return {
    isDosen,
    isPraktikan,
    isStaff,
    isElektro,
    angkatan: Number(angkatan),
    nim: Number(nim),
    validDomain,
  };
};

export const jwtVerifySecret = (jwts: string) => {
  let valid = null;
  jwt.verify(jwts, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) valid = false;
    if (decoded) valid = true;
  });
  return { valid };
};

export const sendRespObj = (
  code: number,
  message: string,
  result: object = {},
) => {
  return {
    status: code === 1 ? 'success' : 'error',
    code,
    data: { message, result },
  };
};

export const forgotPasswordTemplate = async (email: string, code: string) => {
  const options = {
    from: 'ALTE_App <alte.karabar@gmail.com>',
    to: email,
    code: code,
    subject: 'Reset your ALTE Password',
    text: 'Email service ALTE',
    html: `
    <div style="width:300px;height:350px; border-radius:8px; background:#f5f5f5; padding: 32px;">
      <img style="filter: invert(1);border-radius: 100%;" src="https://lh3.googleusercontent.com/a/AGNmyxY8BFi2LNITQnzRCPpkiaw93BK1GdZ6wij_KIMP=s576" width="72px" height="72px" />
      <h3>Hello from ALTE team</h3>
      <p style="font-size:14px;">Someone (hopefully you) has requested a password reset for your ALTE account. Provide the code below to reset your password</p>
      <p style="font-size:14px;" >if you don't wish to reset your password, disregard this email and no action will be taken.</p>
      <h3>Code : ${code}</h3>

    </div>`,
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
        user: 'alte.karabar@gmail.com',
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

export const generateCode = () => {
  const random = () => Math.floor(Math.random() * 8) + 1;
  const number = () => random();
  const alphabet = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
  let code = '';
  const alphabetPosition = () => Math.floor(Math.random() * 6);
  const alphabetIndex = () => Math.floor(Math.random() * 26);

  for (let i = 0; i < 6; i++) {
    if (i === alphabetPosition()) code += alphabet[alphabetIndex()];
    else {
      code += `${number()}`;
    }
  }
  return code;
};
