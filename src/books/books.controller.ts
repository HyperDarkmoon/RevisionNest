import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookResponseDto } from './dto/book-response.dto';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a book (admin only)' })
  @ApiCreatedResponse({ type: BookResponseDto })
  @Post()
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all books' })
  @ApiOkResponse({ type: [BookResponseDto] })
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by ID' })
  @ApiOkResponse({ type: BookResponseDto })
  @ApiNotFoundResponse({ description: 'Book not found' })
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a book (admin only)' })
  @ApiOkResponse({ type: BookResponseDto })
  @ApiNotFoundResponse({ description: 'Book not found' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.booksService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a book (admin only)' })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  @ApiNotFoundResponse({ description: 'Book not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
