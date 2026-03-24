// ===== dto/register.dto.ts =====
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  fullName: string

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string

  @ApiProperty({ example: '0901234567' })
  @IsString()
  phone: string

  @ApiProperty({ example: 'Password@123', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'Mật khẩu tối thiểu 8 ký tự' })
  password: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string
}
