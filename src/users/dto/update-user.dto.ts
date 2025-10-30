import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../schemas/user.schema';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'alice2' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ example: 'alice2@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'newsecret123', minLength: 6 })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.Admin })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ description: 'Relative path to profile image', example: 'uploads/profile-images/xyz.jpg' })
  @IsOptional()
  @IsString()
  image?: string;
}
