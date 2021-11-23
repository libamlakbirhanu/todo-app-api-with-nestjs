import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from './../services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.headers?.authorization.split(' ')[1];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('secret'),
    });
  }

  async validate(payload: any) {
    return this.userService.getByEmail(payload.email);
  }
}
