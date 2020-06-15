import { model, Schema, Document, PaginateModel, Query } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IPost } from '@Interfaces/post.interface';
import { string_to_slug } from '@Utils/uri';

export interface IPostSchema extends Document, IPost {
    toJSON: () => Partial<IPostSchema>;
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

postSchema.methods.toJSON = function (): Partial<IPostSchema> {
    const post = this;
    const objectPost = post.toObject();
    objectPost.id = objectPost._id;
    objectPost.author = this.author?.toJSON();
    delete objectPost._id;
    delete objectPost.password;
    delete objectPost.__v;
    return objectPost;
};

postSchema.plugin(mongoosePaginate);

export default model<IPostSchema>('Post', postSchema) as PostModel<IPostSchema>;
