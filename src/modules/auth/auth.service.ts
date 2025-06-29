/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRequest } from './auth.request.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserWithoutPassword } from '../user/user.interface';
import { ILoginResponse } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async authenticate(request: AuthRequest): Promise<unknown> {
    const user = await this.validateUser(request.email, request.password);
    console.log(user);

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    return 'Hello World!';
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user;

    return result;
  }
}
