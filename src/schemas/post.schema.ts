import { model, Schema, Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IPost } from '../interfaces/post.model';

const string_to_slug = (str: string): string => {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}

export interface IPostSchema extends Document, IPost {
    toJSON: () => Partial<IPostSchema>;
}

interface PostModel<T extends Document> extends PaginateModel<T> {}

const postSchema = new Schema<IPostSchema>({
    title: { unique: true, type: String, required: [true, 'Title required'], trim: true, text: true },
    content: { type: String, required: [true, 'Message required'] },
    author: { type: Schema.Types.ObjectId, ref: "User", required: [true, 'User required'] },
    isPublic: { type: Boolean, default: false },
    slug: { type: String, trim: true }
}, {
    timestamps: true
});

postSchema.pre<IPostSchema>("save", async function(next) {
    const post = this;
    if (!post.isModified('title')) return next();
    post.slug = string_to_slug(post.title);    
    next();
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

export default model<IPostSchema>('Post', postSchema) as PostModel<IPostSchema>;