import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AppRequest } from '../types';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AppRequest>();
    const token = req.cookies?.auth_token;

    if (!token) throw new UnauthorizedException('Unauthorized');

    const isValid = await this.authService.validateToken(token);
    if (!isValid) throw new UnauthorizedException('Unauthorized');

    const user = await this.userModel.findOne({ accessToken: token }).exec();
    if (!user) throw new UnauthorizedException('Unauthorized');

    req.userId = user.id;

    return true;
  }
}
