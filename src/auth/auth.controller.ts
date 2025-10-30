import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login with username or email and password' })
  @ApiOkResponse({ type: LoginResponseDto })
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.identifier, body.password);
  }
}
