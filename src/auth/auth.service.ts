import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, password: string) {
    // identifier can be username or email
    const userDoc = await this.usersService.findDocumentByUsernameOrEmail(identifier);
    if (!userDoc) throw new UnauthorizedException('Invalid credentials');
    const match = await bcrypt.compare(password, userDoc.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');
    return this.usersService['sanitize'](userDoc);
  }

  async login(identifier: string, password: string) {
  const user = await this.validateUser(identifier, password);
  const payload = { sub: (user as any)._id, username: user.username, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user,
    };
  }
}
