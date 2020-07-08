import { IPost } from '@Interfaces/post.interface';
import { string_to_slug } from '@Utils/uri';
import { Document, model, PaginateModel, Query, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IUserSchema } from './user.schema';

export interface IPostSchema extends Document, IPost {
    toJSON: () => Partial<IPost>;
    author: IUserSchema;
}

interface PostModel<T extends Document> extends PaginateModel<T> {}

const postSchema = new Schema<IPostSchema>(
    {
        title: {
            unique: true,
            type: String,
            required: [true, 'Title required'],
            trim: true,
            text: true,
        },
        content: { type: String, required: [true, 'Content required'] },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User required'],
        },
        isPublic: { type: Boolean, default: false },
        slug: { type: String, trim: true },
    },
    {
        timestamps: true,
    }
);

postSchema.pre<IPostSchema>('save', function (next) {
    const post = this;
    if (!post.isModified('title')) return next();
    post.slug = string_to_slug(post.title);
    next();
});

postSchema.pre<Query<IPostSchema>>('findOneAndUpdate', function (next) {
    const post = this.getUpdate();
    post.slug = string_to_slug(post.title);
    next();
});

postSchema.methods.toJSON = function (): Partial<IPost> {
    const { id, createdAt, updatedAt, title, content, slug, isPublic } = this;
    const jSon: Partial<IPost> = {
        id,
        createdAt,
        updatedAt,
        title,
        content,
        slug,
        isPublic,
        author:
            typeof this.author === 'string'
                ? this.author
                : this.author.toJSON(),
    };
    return jSon;
};

postSchema.plugin(mongoosePaginate);

export default model<IPostSchema>('Post', postSchema) as PostModel<IPostSchema>;
