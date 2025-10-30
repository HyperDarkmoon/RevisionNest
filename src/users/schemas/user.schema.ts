import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Borrow, BorrowSchema } from './borrow.schema';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  User = 'user',
  Admin = 'admin',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  // Hashed password
  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: Object.values(UserRole), default: UserRole.User })
  role: UserRole;

  // Local filesystem path to the profile image
  @Prop({ required: false })
  image?: string;

  @Prop({ type: [BorrowSchema], default: [] })
  borrows: Borrow[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Helpful index to enforce uniqueness at DB level
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });

// Remove password when converting to JSON / Object
UserSchema.set('toJSON', {
  transform: (_doc: any, ret: any, _options: any) => {
    delete ret.password;
    return ret;
  },
});
UserSchema.set('toObject', {
  transform: (_doc: any, ret: any, _options: any) => {
    delete ret.password;
    return ret;
  },
});
