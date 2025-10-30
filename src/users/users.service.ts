import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Book, BookDocument } from '../books/schemas/book.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
  ) {}

  sanitize(user: UserDocument) {
    const obj = user.toObject();
    delete (obj as any).password;
    return obj;
  }

  async findByUsernameOrEmail(identifier: string) {
    const doc = await this.userModel
      .findOne({ $or: [{ username: identifier }, { email: identifier.toLowerCase() }] })
      .exec();
    return doc ? this.sanitize(doc) : null;
  }

  async findDocumentByUsernameOrEmail(identifier: string) {
    return this.userModel
      .findOne({ $or: [{ username: identifier }, { email: identifier.toLowerCase() }] })
      .exec();
  }

  async getDocumentById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async create(dto: CreateUserDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const created = new this.userModel({ ...dto, email: dto.email.toLowerCase(), password: hashed });
    try {
      const saved = await created.save();
      return this.sanitize(saved);
    } catch (err: any) {
      if (err?.code === 11000) {
        throw new ConflictException('Username or email already exists');
      }
      throw err;
    }
  }

  async findAll() {
    const users = await this.userModel.find().exec();
    return users.map((u) => this.sanitize(u));
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('User not found');
    }
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return this.sanitize(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('User not found');
    }
    const update: any = { ...dto };
    if (dto.password) {
      update.password = await bcrypt.hash(dto.password, 10);
    }
    const user = await this.userModel.findByIdAndUpdate(id, update, { new: true }).exec();
    if (!user) throw new NotFoundException('User not found');
    return this.sanitize(user);
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('User not found');
    }
    const res = await this.userModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('User not found');
    return { deleted: true };
  }

  async me(userId: string) {
    if (!isValidObjectId(userId)) throw new NotFoundException('User not found');
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException('User not found');
    return this.sanitize(user);
  }

  async updateProfileImage(userId: string, imagePath: string) {
    if (!isValidObjectId(userId)) throw new NotFoundException('User not found');
    const user = await this.userModel
      .findByIdAndUpdate(userId, { image: imagePath }, { new: true })
      .exec();
    if (!user) throw new NotFoundException('User not found');
    return this.sanitize(user);
  }

  async borrowBook(userId: string, bookId: string) {
    if (!isValidObjectId(userId) || !isValidObjectId(bookId)) {
      throw new NotFoundException('User or book not found');
    }
    const [user, book] = await Promise.all([
      this.userModel.findById(userId).exec(),
      this.bookModel.findById(bookId).exec(),
    ]);
    if (!user) throw new NotFoundException('User not found');
    if (!book) throw new NotFoundException('Book not found');
    if (!book.available) throw new BadRequestException('Book not available');
    // prevent double borrow if already active
    const alreadyBorrowed = (user.borrows || []).some(
      (b) => (b as any).bookId?.toString() === book._id.toString() && !b.returnDate,
    );
    if (alreadyBorrowed) throw new BadRequestException('Book already borrowed');

    user.borrows = [
      ...user.borrows,
      { bookId: new Types.ObjectId(book._id), borrowDate: new Date(), returnDate: null } as any,
    ];
    book.available = false;
    await Promise.all([user.save(), book.save()]);
    return this.sanitize(user);
  }

  async returnBook(userId: string, bookId: string) {
    if (!isValidObjectId(userId) || !isValidObjectId(bookId)) {
      throw new NotFoundException('User or book not found');
    }
    const [user, book] = await Promise.all([
      this.userModel.findById(userId).exec(),
      this.bookModel.findById(bookId).exec(),
    ]);
    if (!user) throw new NotFoundException('User not found');
    if (!book) throw new NotFoundException('Book not found');

    let updated = false;
    user.borrows = (user.borrows || []).map((b: any) => {
      if (b.bookId?.toString() === book._id.toString() && !b.returnDate) {
        updated = true;
        return { ...b, returnDate: new Date() };
      }
      return b;
    });
    if (!updated) throw new BadRequestException('No active borrow found for this book');
    book.available = true;
    await Promise.all([user.save(), book.save()]);
    return this.sanitize(user);
  }
}
