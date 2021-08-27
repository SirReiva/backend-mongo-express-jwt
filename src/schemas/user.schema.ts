import { IUser, UserRole } from "@Interfaces/user.interface";
import { Document, LeanDocument, model, PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import validator from "validator";

export interface IUserSchema extends Document, IUser {
    toJSON: () => LeanDocument<this>;
}

interface UserModel<T extends Document> extends PaginateModel<T> {}

export const userSchema = new Schema<IUserSchema>(
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

userSchema.plugin(mongoosePaginate as any);

export default model<IUserSchema>("User", userSchema) as UserModel<IUserSchema>;
