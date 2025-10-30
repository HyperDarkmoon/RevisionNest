import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { profileImageMulterOptions, relativeProfileImagePath } from '../common/storage';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Register a new user (with optional profile image)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string', minLength: 6 },
        role: { type: 'string', enum: ['user', 'admin'], nullable: true },
        image: { type: 'string', format: 'binary', nullable: true },
      },
      required: ['username', 'email', 'password'],
    },
  })
  @Post('register')
  @UseInterceptors(FileInterceptor('image', profileImageMulterOptions))
  async register(@Body() dto: CreateUserDto, @UploadedFile() file?: Express.Multer.File) {
    const imagePath = file ? relativeProfileImagePath(file.filename) : undefined;
    return this.usersService.create({ ...dto, image: imagePath });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('admin')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  me(@CurrentUser() user: any) {
    return this.usersService.me(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('me/image')
  @UseInterceptors(FileInterceptor('image', profileImageMulterOptions))
  async updateImage(@CurrentUser() user: any, @UploadedFile() file: Express.Multer.File) {
    const imagePath = relativeProfileImagePath(file.filename);
    return this.usersService.updateProfileImage(user.userId, imagePath);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('me/borrow/:bookId')
  borrow(@CurrentUser() user: any, @Param('bookId') bookId: string) {
    return this.usersService.borrowBook(user.userId, bookId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('me/return/:bookId')
  returnBook(@CurrentUser() user: any, @Param('bookId') bookId: string) {
    return this.usersService.returnBook(user.userId, bookId);
  }

  // Admin can delete by id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
