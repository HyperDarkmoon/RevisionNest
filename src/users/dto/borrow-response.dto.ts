import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BorrowResponseDto {
  @ApiProperty({ description: 'Book ObjectId', example: '6767a2de9a2b0c3f1a1b2c3d' })
  bookId: string;

  @ApiProperty({ type: String, format: 'date-time' })
  borrowDate: Date;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  returnDate?: Date | null;
}
