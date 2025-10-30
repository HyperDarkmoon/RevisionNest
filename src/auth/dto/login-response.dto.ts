import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  access_token: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
