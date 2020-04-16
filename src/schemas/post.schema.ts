import { model, Schema, Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IPost } from '../models/post.model';

export interface IPostSchema extends Document, IPost {
    toJSON: () => Partial<IPostSchema>;
}

interface UserModel<T extends Document> extends PaginateModel<T> {}

const postSchema = new Schema<IPostSchema>({
    title: { type: String, required: [true, 'Title required'], trim: true, text: true },
    content: { type: String, required: [true, 'Message required'] },
    author: { type: Schema.Types.ObjectId, ref: "User", required: [true, 'User required'] },
}, {
    timestamps: true
});

postSchema.methods.toJSON = function(): Partial<IPostSchema> {
    const post = this;
    const objectPost = post.toObject();
    objectPost.id = objectPost._id;
    objectPost.author = this.author?.toJSON();
    delete objectPost._id;
    delete objectPost.password;
    delete objectPost.__v;
    return objectPost;
}

postSchema.plugin(mongoosePaginate);

export default model<IPostSchema>('Post', postSchema) as UserModel<IPostSchema>;