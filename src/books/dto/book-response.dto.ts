import { ApiProperty } from '@nestjs/swagger';

export class BookResponseDto {
  @ApiProperty({ description: 'Book ObjectId', example: '6767a2de9a2b0c3f1a1b2c3d' })
  _id: string;

  @ApiProperty({ example: 'Clean Architecture' })
  title: string;

  @ApiProperty({ example: 'Robert C. Martin' })
  author: string;

  @ApiProperty({ example: true })
  available: boolean;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;
}
