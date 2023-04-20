export class CreateUserDto {
  email: string;
  password: string;
  fullname: string;
  nim: number;
  angkatan: number;
  created_at: string;
  role: { main: string; secondary: string };
  secret: string;
  is_finger_registered: boolean;
  _id: string;
  profile: object;
  googlePass: string;
}
export class LoginDto {
  email: string;
  password: string;
  token: string;
  resetPasswordToken: string;
  profile: object;
}
export class UpdateUserDto {
  group_id: string;
  finger_id: number;
}
