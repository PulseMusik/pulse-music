import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

import * as sanitizeHtml from 'sanitize-html';

export class LoginSanitizeDto {
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email is required' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        const clean = sanitizeHtml(value, {
            allowedTags: [], // no tags allowed at all
            allowedAttributes: {},
        });
        return clean.trim().toLowerCase();
    })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @Length(8, 128, { message: 'Password must be between 8 and 128 characters' })
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        const clean = sanitizeHtml(value, {
            allowedTags: [],
            allowedAttributes: {},
        });
        return clean.trim();
    })
    password: string;
}
