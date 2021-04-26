import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  roles: number;
  passwordChangedAt: number;
  passwordResetToken: string;
  passwordResetExpires: number;
  active: boolean;
}

interface UserModel extends mongoose.Model<any, {}> {}

const userSchema = new mongoose.Schema<UserDocument, UserModel>({
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
  passwordChangedAt: Number,
  passwordResetToken: String,
  passwordResetExpires: Number,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

const User = mongoose.model('User', userSchema);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.pre('save', function (next) {
  if(!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now();

  next();
});

userSchema.pre<UserModel>(/^find/, function (next) {
  this.find({ active: { $ne: false } });
});
