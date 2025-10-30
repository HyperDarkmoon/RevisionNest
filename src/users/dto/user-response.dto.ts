import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../schemas/user.schema';
import { BorrowResponseDto } from './borrow-response.dto';

export class UserResponseDto {
  @ApiProperty({ description: 'User ObjectId', example: '6767a2de9a2b0c3f1a1b2c3d' })
  _id: string;

  @ApiProperty({ example: 'alice' })
  username: string;

  @ApiProperty({ example: 'alice@example.com' })
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.User })
  role: UserRole;

  @ApiPropertyOptional({ description: 'Relative path to profile image', example: 'uploads/profile-images/abc.jpg' })
  image?: string;

  @ApiProperty({ type: [BorrowResponseDto] })
  borrows: BorrowResponseDto[];
}
