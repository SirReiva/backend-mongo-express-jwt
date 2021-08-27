import { IPost } from "@Interfaces/post.interface";
import { string_to_slug } from "@Utils/uri";
import { Document, LeanDocument, model, PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import userSchema from "./user.schema";

export interface IPostSchema extends Document, IPost {
    toJSON: () => LeanDocument<this>;
}

interface PostModel<T extends Document> extends PaginateModel<T> {}

const postSchema = new Schema<IPostSchema>(
    {
        title: {
            unique: true,
            type: String,
            required: [true, "Title required"],
            trim: true,
            text: true,
        },
        content: { type: String, required: [true, "Content required"] },
        author: {
            type: String,
            ref: "User",
            required: [true, "User required"],
        },
        isPublic: { type: Boolean, default: false },
        slug: { type: String, trim: true },
    },
    {
        timestamps: true,
    }
);

postSchema.pre<IPostSchema>("save", function (next) {
    const post = this;
    if (!post.isModified("title")) return next();
    post.slug = string_to_slug(post.title);
    next();
});

postSchema.methods.toJSON = function (): Partial<IPost> {
    const { id, createdAt, updatedAt, title, content, slug, isPublic, author } =
        this;
    const jSon: Partial<IPost> = {
        id,
        createdAt,
        updatedAt,
        title,
        content,
        slug,
        isPublic,
        author,
    };
    return jSon;
};

postSchema.plugin(mongoosePaginate as any);

export default model<IPostSchema>("Post", postSchema) as PostModel<IPostSchema>;
