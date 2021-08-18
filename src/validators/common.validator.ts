import Validator, { ValidationError } from 'fastest-validator';
import { ErrorHandler } from '@Error/index';
import HTTP_CODES from 'http-status-codes';

export const fastValidator = new Validator({
    defaults: {
        object: {
            strict: 'remove',
        },
    },
});

export const validateError = (
    schemaValidator: (value: any) => true | ValidationError[] | Promise<true | ValidationError[]>
) => (target: Object) => {
    const errors = schemaValidator(target);
    if (Array.isArray(errors)) {
        throw new ErrorHandler(
            HTTP_CODES.BAD_REQUEST,
            errors.map((err) => err.message).join('\n')
        );
    }
};
