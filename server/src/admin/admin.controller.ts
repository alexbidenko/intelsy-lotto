import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('members')
  getMembers() {
    return this.adminService.getMembers();
  }

  @Get('board')
  getUserBoard(@Query('user_id', ParseIntPipe) userId: number) {
    return this.adminService.getUserBoard(userId);
  }

  @Get('events')
  getEvents() {
    return this.adminService.events();
  }
}
