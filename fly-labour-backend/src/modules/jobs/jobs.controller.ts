import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, Request,
  UseInterceptors, UploadedFile
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger'
import { memoryStorage } from 'multer'
import { JobsService } from './jobs.service'
import { CreateJobDto, UpdateJobDto, QueryJobDto } from './dto/job.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { AdminGuard } from '../../common/guards/admin.guard'

@ApiTags('💼 Việc làm')
@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  // ── PUBLIC ──────────────────────────────────────────
  @Get()
  @ApiOperation({ summary: 'Danh sách việc làm (có filter + phân trang)' })
  findAll(@Query() query: QueryJobDto) {
    return this.jobsService.findAll(query)
  }

  @Get('hot')
  @ApiOperation({ summary: 'Việc làm Hot / Flash Sale' })
  findHot() {
    return this.jobsService.findHot()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết bài đăng' })
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id)
  }

  // ── ADMIN ────────────────────────────────────────────
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Tất cả bài đăng kể cả draft' })
  findAllAdmin(@Query() query: QueryJobDto) {
    return this.jobsService.findAllAdmin(query)
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Thống kê tổng quan' })
  getStats() {
    return this.jobsService.getStats()
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Tạo bài đăng mới' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  create(@Body() dto: CreateJobDto, @UploadedFile() file?: Express.Multer.File) {
    return this.jobsService.create(dto, file)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Cập nhật bài đăng' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  update(@Param('id') id: string, @Body() dto: UpdateJobDto, @UploadedFile() file?: Express.Multer.File) {
    return this.jobsService.update(id, dto, file)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Xóa bài đăng' })
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id)
  }
}
