import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { CategoriesService, CreateCategoryDto } from './categories.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { AdminGuard } from '../../common/guards/admin.guard'

@ApiTags('🏷️ Danh mục')
@Controller('categories')
export class CategoriesController {
  constructor(private catsService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách danh mục (public)' })
  findAll() { return this.catsService.findAll() }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  findAllAdmin() { return this.catsService.findAllAdmin() }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Tạo danh mục' })
  create(@Body() dto: CreateCategoryDto) { return this.catsService.create(dto) }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Cập nhật danh mục' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateCategoryDto>) {
    return this.catsService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Xóa danh mục' })
  remove(@Param('id') id: string) { return this.catsService.remove(id) }
}
