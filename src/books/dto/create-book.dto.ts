import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: 'Clean Code' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Robert C. Martin' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
