import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Book {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  author: string;

  @Prop({ type: Boolean, default: true })
  available: boolean;

  // createdAt added automatically by timestamps
  createdAt: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);
