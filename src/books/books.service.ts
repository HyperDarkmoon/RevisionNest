import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  create(dto: CreateBookDto) {
    const created = new this.bookModel(dto);
    return created.save();
  }

  findAll() {
    return this.bookModel.find().exec();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) throw new NotFoundException('Book not found');
    const book = await this.bookModel.findById(id).exec();
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: string, dto: UpdateBookDto) {
    if (!isValidObjectId(id)) throw new NotFoundException('Book not found');
    const book = await this.bookModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) throw new NotFoundException('Book not found');
    const book = await this.bookModel.findByIdAndDelete(id).exec();
    if (!book) throw new NotFoundException('Book not found');
    return { deleted: true };
  }
}
