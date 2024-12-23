import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BitrixService {
  private BITRIX_CLIENT_ID = this.configService.get('BITRIX_CLIENT_ID');
  private BITRIX_CLIENT_SECRET = this.configService.get('BITRIX_CLIENT_SECRET');
  private BITRIX_HOOK_KEY = this.configService.get('BITRIX_HOOK_KEY');

  private BITRIX_TOKEN_URL = 'https://mstagency.bitrix24.ru/oauth/token/';
  private BITRIX_API_URL = 'https://mstagency.bitrix24.ru/rest/';

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getTokens(code: string) {
    let response = await axios.get(this.BITRIX_TOKEN_URL, {
      params: {
        grant_type: 'authorization_code',
        client_id: this.BITRIX_CLIENT_ID,
        client_secret: this.BITRIX_CLIENT_SECRET,
        code,
      },
    });

    const { access_token, refresh_token, user_id } = response.data;

    response = await axios.post(
      `${this.BITRIX_API_URL}${this.BITRIX_HOOK_KEY}/user.current`,
      { auth: access_token },
    );

    const { id: _, ...user } = this.normalizeUser(response.data);
    await this.userModel.updateOne(
      { id: user_id },
      {
        accessToken: access_token,
        refreshToken: refresh_token,
        ...user,
      },
      {
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  }

  async getUser(accessToken: string) {
    const data = await this.fetch('user.current', accessToken);

    return this.normalizeUser(data);
  }

  normalizeUser(data: any) {
    return {
      id: +data.result.ID,
      firstName: data.result.NAME,
      lastName: data.result.LAST_NAME,
      email: data.result.EMAIL,
      avatar: data.result.PERSONAL_PHOTO,
    };
  }

  private async fetch(method: string, accessToken: string, params: any = {}) {
    const user = await this.userModel.findOne({ accessToken });
    if (!user) throw new UnauthorizedException();

    let response = await axios.get(
      `https://oauth.bitrix.info/oauth/token/?client_id=${this.BITRIX_CLIENT_ID}&grant_type=refresh_token&client_secret=${this.BITRIX_CLIENT_SECRET}&refresh_token=${user.refreshToken}`,
    );

    await this.userModel.updateOne(
      { id: response.data.user_id },
      { refreshToken: response.data.refresh_token },
    );

    response = await axios.post(
      `${this.BITRIX_API_URL}${this.BITRIX_HOOK_KEY}/${method}`,
      { auth: response.data.access_token, ...params },
    );

    return response.data;
  }
}
