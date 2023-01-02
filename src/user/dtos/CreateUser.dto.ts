export class CreateUserDto {
  email: string;
  password: string;
  fullname: string;
  nim: number;
  angkatan: number;
  created_at: string;
  role: string;
  finger_id: number;
  resetPasswordToken: string;
}
export class LoginDto {
  email: string;
  password: string;
}
export class UpdateUserDto {
  email: string;
  password: string;
  phone: string;
  username: string;
  refreshToken: string;
}
