import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../schemas/user.schema';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'alice' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'alice@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secret123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.User })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ description: 'Relative path to profile image', example: 'uploads/profile-images/abc.jpg' })
  @IsOptional()
  @IsString()
  image?: string;
}
