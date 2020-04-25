import { fastValidator, validateError } from './common.validator';
import { ValidationSchema } from 'fastest-validator';


const CreatePostSchema: ValidationSchema = {
    title: { type: "string", min: 3, max: 255, required: true },
    author: { type: "string", required: true },
    content: { type: 'string', required: true },
    $$strict: true
};

export const CreatePostSchemaValidator = validateError(fastValidator.compile(CreatePostSchema));