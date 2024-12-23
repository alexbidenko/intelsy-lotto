import {
  Controller,
  Post,
  Query,
  Get,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async exchangeCode(@Query('code') code: string) {
    if (!code) throw new BadRequestException('Code not provided');

    const token = await this.authService.exchangeCodeForToken(code);

    return { token };
  }

  @Get()
  getUser(@Req() req: FastifyRequest) {
    if (!req.cookies.auth_token)
      throw new BadRequestException('Token not provided');

    return this.authService.loadUser(req.cookies.auth_token);
  }
}
