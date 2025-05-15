import {
    IsString,
    IsOptional,
    IsNotEmpty,
    IsNumber,
    ValidateNested,
    IsDefined,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    Validate,
    IsEnum,
    IsEmail
} from 'class-validator';
import { Type } from 'class-transformer';
import { ValidMonths } from './valid-months.enum';
import { Trim, Escape } from 'src/common/sanitize';

enum Genders {
    Male = 'male',
    Female = 'female',
    PreferNotToSay = 'prefer-not-to-say',
}

@ValidatorConstraint({ name: 'IsValidDate', async: false })
class IsValidDateConstraint implements ValidatorConstraintInterface {
    validate(_: any, args: ValidationArguments) {
        const dob = args.object as any;

        const monthIndex = Object.values(ValidMonths).indexOf(dob.month);
        if (monthIndex === -1) return false;

        const date = new Date(dob.year, monthIndex, dob.day);
        return (
            date.getFullYear() === dob.year &&
            date.getMonth() === monthIndex &&
            date.getDate() === dob.day
        );
    }

    defaultMessage(args: ValidationArguments) {
        return `The combination of day, month, and year is not a valid date.`;
    }
}

export class DobDto {
    @IsNumber()
    day: number;

    @IsEnum(ValidMonths, {
        message: `Month must be a valid full month name (e.g., January, February, etc.)`,
    })
    month: ValidMonths;

    @IsNumber()
    year: number;

    @Validate(IsValidDateConstraint)
    dateValid?: boolean;
}

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Trim()
    @Escape()
    firstName: string;

    @IsOptional()
    @IsString()
    @Trim()
    @Escape()
    middleName?: string;

    @IsString()
    @IsNotEmpty()
    @Trim()
    @Escape()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    @Trim()
    @Escape()
    username: string;

    @IsString()
    @IsNotEmpty()
    @Trim()
    @Escape()
    password: string;

    @IsOptional()
    @IsString()
    @Trim()
    @Escape()
    profile_picture: string

    @IsEmail({}, {
        message: 'Email must be a valid email address',
    })
    @Trim()
    @Escape()
    email: string;

    @ValidateNested()
    @IsDefined()
    @Trim()
    @Escape()
    @Type(() => DobDto)
    dob: DobDto;

    @IsEnum(Genders, {
        message: `Gender required to be male, female, or prefer not to say`,
    })
    gender: Genders;
}