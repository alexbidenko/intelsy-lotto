import { Controller, Get, Post, Req, Body, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { AuthGuard } from '../auth/auth.guard';
import { AppRequest } from '../types.d';

@Controller('game')
@UseGuards(AuthGuard)
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('state')
  getState() {
    return this.gameService.getState();
  }

  @Get('board')
  getBoard(@Req() req: AppRequest) {
    return this.gameService.getBoard(req.userId);
  }

  @Get('values')
  getValues() {
    return this.gameService.getValues();
  }

  @Get('choices')
  getChoices(@Req() req: AppRequest) {
    return this.gameService.getChoices(req.userId);
  }

  @Post('choices')
  createChoice(@Req() req: AppRequest, @Body() body: { value: number }) {
    return this.gameService.createChoice(req.userId, body.value);
  }
}
