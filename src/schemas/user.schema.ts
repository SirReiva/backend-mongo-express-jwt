import bcrypt from 'bcrypt';
import { Document, model, PaginateModel, Schema, Query } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import validator from 'validator';
import { IUser, UserRole } from '@Interfaces/user.interface';

export interface IUserSchema extends Document, IUser {
    comparePassword: (p: string) => Promise<boolean>;
    toJSON: () => Partial<IUser>;
}

interface UserModel<T extends Document> extends PaginateModel<T> {}

const userSchema = new Schema<IUserSchema>(
    {
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate: (value: string): boolean => {
                return validator.isEmail(value);
            },
        },
        password: {
            type: String,
            required: true,
            minlength: 4,
        },
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
        },
        role: {
            type: String,
            enum: [UserRole.USER, UserRole.ADMIN, UserRole.SUPER],
            default: UserRole.USER,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre<IUserSchema>('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
});

userSchema.pre<Query<IUserSchema>>('findOneAndUpdate', async function (next) {
    const user = this.getUpdate();
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
});

userSchema.methods.comparePassword = function (
    password: string
): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.toJSON = function (): Partial<IUser> {
    return {
        id: this.id,
        name: this.name,
        role: this.role,
        active: this.active,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};

userSchema.plugin(mongoosePaginate);

export default model<IUserSchema>('User', userSchema) as UserModel<IUserSchema>;
