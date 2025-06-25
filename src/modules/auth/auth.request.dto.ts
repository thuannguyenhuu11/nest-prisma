import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class AuthRequest {
  @IsEmail({}, { message: 'Email không đúng định dạng ví dụ: abc@gmail.com' })
  @IsString({ message: 'Email phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;
}
