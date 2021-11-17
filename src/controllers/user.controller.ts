import {
  Controller,
  Get,
  Patch,
  Request,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from 'src/dto/userupdate.dto';
import { UserService } from 'src/services/user.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Body() updateInfo: UpdateUserDto, @Request() req) {
    const user = this.userService.updateUser(updateInfo, req.user);

    return user;
  }
}
