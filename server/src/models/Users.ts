import {CallbackError, Model, Schema, model} from 'mongoose'
import bcrypt from 'bcrypt'
const SALT_WORK_FACTOR = 10;

export interface IUser {
  username: string;
  password: string;
  isAdmin: boolean;
}

interface IUserMethods {
  validatePassword(pass: string): Promise<Boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  }
});


UserSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err as CallbackError);
  }
});

UserSchema.method('validatePassword', async function validatePassword(pass : string) : Promise<Boolean> {
  return bcrypt.compare(pass, this.password);
});

export default model<IUser, UserModel>('User', UserSchema);