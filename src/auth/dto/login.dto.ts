import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Username or email', example: 'alice' })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ description: 'User password', example: 'secret123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
