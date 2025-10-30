import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBookDto {
  @ApiPropertyOptional({ example: 'The Pragmatic Programmer' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Andrew Hunt' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
