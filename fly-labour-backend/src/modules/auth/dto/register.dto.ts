import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator'
import { UserRole } from '../../users/user.entity'
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

  @ApiProperty({ required: false, enum: [UserRole.USER, UserRole.EMPLOYER], description: 'Account type: job seeker or employer' })
  @IsEnum([UserRole.USER, UserRole.EMPLOYER], { message: 'role must be user or employer' })
  @IsOptional()
  role?: UserRole

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  companyName?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  website?: string
}
