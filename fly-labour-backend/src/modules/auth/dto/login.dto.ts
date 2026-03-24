import { IsEmail, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({ example: 'admin@flylabour.com' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string

  @ApiProperty({ example: 'Admin@123' })
  @IsString()
  password: string
}
