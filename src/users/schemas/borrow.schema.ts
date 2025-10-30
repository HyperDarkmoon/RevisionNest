import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ _id: false })
export class Borrow {
  @Prop({ type: Types.ObjectId, ref: 'Book', required: true })
  bookId: Types.ObjectId;

  @Prop({ type: Date, default: () => new Date() })
  borrowDate: Date;

  @Prop({ type: Date, required: false, default: null })
  returnDate?: Date | null;
}

export type BorrowDocument = HydratedDocument<Borrow>;
export const BorrowSchema = SchemaFactory.createForClass(Borrow);
