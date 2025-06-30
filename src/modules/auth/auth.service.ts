/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRequest } from './auth.request.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserWithoutPassword } from '../user/user.interface';
import { IJwtPayload, ILoginResponse } from './auth.interface';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async authenticate(request: AuthRequest): Promise<ILoginResponse> {
    const user = await this.validateUser(request.email, request.password);
    console.log(user);

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const payload = { sub: user.id.toString() };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = randomBytes(32).toString('hex');
    const crsfToken = randomBytes(32).toString('hex');
    //RefreshToken và CrsfToken lưu vào redis để sau này còn so sánh

    const refreshTokenCacheData: { userId: string; expiresAt: number } = {
      userId: user.id.toString(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    };

    await this.cacheManager.set(
      `refresh_token:${refreshToken}`,
      refreshTokenCacheData,
      30 * 24 * 60 * 60,
    ); // Set cache for 30 days

    return this.authResponse(accessToken, crsfToken);
  }

  authResponse(accessToken: string, crsfToken: string): ILoginResponse {
    const decoded = this.jwtService.decode<IJwtPayload>(accessToken);
    const expiresAt = decoded.exp - Math.floor(Date.now() / 1000);

    return {
      accessToken: accessToken,
      expiresAt: expiresAt,
      tokenType: 'Bearer',
      crsfToken: crsfToken,
    };
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
