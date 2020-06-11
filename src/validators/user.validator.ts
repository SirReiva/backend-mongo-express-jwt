import { fastValidator, validateError } from '@Validators/common.validator';
import { ValidationSchema } from 'fastest-validator';
import { UserRole } from '@Interfaces/user.model';

const CreateUserSchema: ValidationSchema = {
    name: { type: 'string', min: 3, max: 255, required: true },
    email: { type: 'email', normalize: true, required: true },
    password: { type: 'string', required: true },
    role: {
        type: 'enum',
        values: [UserRole.USER, UserRole.ADMIN, UserRole.USER],
        default: UserRole.USER,
    },
    $$strict: true,
};

const SingInUserSchema: ValidationSchema = {
    name: { type: 'string', min: 3, max: 255, required: true },
    password: { type: 'string', required: true },
    $$strict: true,
};

const ReSingInUserSchema: ValidationSchema = {
    refreshToken: { type: 'string', required: true },
    $$strict: true,
};

const UpdateUserSchema: ValidationSchema = {
    name: { type: 'string', min: 3, max: 255 },
    email: { type: 'email', normalize: true },
    role: {
        type: 'enum',
        values: [UserRole.USER, UserRole.ADMIN, UserRole.USER],
    },
    password: { type: 'string' },
    $$strict: true,
};

export const SignInUserSchemaValidator = validateError(
    fastValidator.compile(SingInUserSchema)
);
export const ReSignInUserSchemaValidator = validateError(
    fastValidator.compile(ReSingInUserSchema)
);
export const CreateUserSchemaValidator = validateError(
    fastValidator.compile(CreateUserSchema)
);
export const UpdateserSchemaValidator = validateError(
    fastValidator.compile(UpdateUserSchema)
);
