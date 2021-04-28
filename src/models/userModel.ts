import mongoose, { Model, Document, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Parameters needed to create and user
interface UserAttrs {
  email: string;
  password: string;
  roles?: number[];
}

// Document interface description
interface UserDocument extends Document {
  email: string;
  password: string;
  roles: number[];
  createdAt: Date;
  passwordChangedAt?: number;
  passwordResetToken?: string;
  passwordResetExpires?: number;
  active: boolean;
}

// New static methods of the model
interface UserModel extends Model<any> {
  build(attrs: UserAttrs): UserDocument;
}

const userSchema = new Schema<UserDocument, UserModel>(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      validate: [validator.isEmail, 'Provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'You must provide a password'],
      minlength: 8,
      select: false,
    },
    roles: {
      type: Number,
      default: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now();

  next();
});

userSchema.pre<UserModel>(/^find/, function (next) {
  this.find({ active: { $ne: false } });
});

userSchema.methods.correctPasswords = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export default User;
