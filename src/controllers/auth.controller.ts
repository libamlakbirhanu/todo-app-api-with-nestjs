import {
  Controller,
  Request,
  Response,
  Post,
  Body,
  UseGuards,
  // Get,
} from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import RegisterDto from 'src/dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const user = await this.authService.register(body);
    // const cookie = await this.authService.createCookieWithToken(user);
    // response.setHeader('Set-Cookie', cookie);
    // user.password = undefined;
    // return response.send(user);
    return { user };
  }

  @Post('authcheck')
  @UseGuards(JwtAuthGuard)
  async authCheck(@Request() request, @Response() response) {
    const { user } = request;
    user.password = undefined;
    return response.send(user);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() request, @Response() response) {
    const { user } = request;
    const cookie = await this.authService.createCookieWithToken(user);
    // response.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return response.send({ ...user, accessToken: cookie });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Response() response) {
    response.setHeader(
      'Set-Cookie',
      `accessToken=; HttpOnly; Path=/; Max-Age=0`,
    );
    return response.sendStatus(200);
  }
}
