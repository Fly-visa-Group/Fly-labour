import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterDto {
  @ApiProperty({ example: 'John Smith' })
  @IsString()
  fullName: string

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string

  @ApiProperty({ example: '0901234567' })
  @IsString()
  phone: string

  @ApiProperty({ example: 'Password@123', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string

  @ApiProperty({ required: false, enum: ['user', 'employer'], description: 'Account type: job seeker or employer' })
  @IsString()
  @IsOptional()
  @IsIn(['user', 'employer'])
  role?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  companyName?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  website?: string
}
