import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { BitrixService } from '../bitrix/bitrix.service';

@Injectable()
export class AuthService {
  logger = new Logger(AuthService.name);

  constructor(private readonly bitrixService: BitrixService) {}

  async exchangeCodeForToken(code: string) {
    try {
      const { accessToken } = await this.bitrixService.getTokens(code);
      if (!accessToken)
        throw new BadRequestException('No access_token returned');

      return accessToken;
    } catch (e) {
      this.logger.error('Authorization process error:', e);
      throw new BadRequestException('Failed to exchange code');
    }
  }

  loadUser(accessToken: string) {
    return this.bitrixService.getUser(accessToken);
  }

  async validateToken(token: string): Promise<boolean> {
    return !!token;
  }
}
