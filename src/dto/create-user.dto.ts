import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @MinLength(7)
    @MaxLength(15)
    mobile_number: string;
}
