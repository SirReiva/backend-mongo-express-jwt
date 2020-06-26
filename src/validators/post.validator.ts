import { fastValidator, validateError } from '@Validators/common.validator';
import { ValidationSchema } from 'fastest-validator';

const CreatePostSchema: ValidationSchema = {
    title: { type: 'string', min: 3, max: 255, required: true },
    content: { type: 'string', required: true },
    isPublic: { type: 'boolean', required: false },
    $$strict: true,
};

export const CreatePostSchemaValidator = validateError(
    fastValidator.compile(CreatePostSchema)
);
export const UpdatePostSchemaValidator = validateError(
    fastValidator.compile(CreatePostSchema)
);
