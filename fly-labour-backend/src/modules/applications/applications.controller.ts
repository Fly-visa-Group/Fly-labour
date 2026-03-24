import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { ApplicationsService, CreateApplicationDto, UpdateApplicationStatusDto } from './applications.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { AdminGuard } from '../../common/guards/admin.guard'

@ApiTags('📋 Đơn ứng tuyển')
@Controller('applications')
export class ApplicationsController {
  constructor(private appsService: ApplicationsService) {}

  @Post()
  @ApiOperation({ summary: 'Nộp đơn ứng tuyển (không cần đăng nhập)' })
  create(@Body() dto: CreateApplicationDto, @Request() req: any) {
    return this.appsService.create(dto, req.user?.id)
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Đơn ứng tuyển của tôi' })
  myApplications(@Request() req: any) {
    return this.appsService.findByUser(req.user.id)
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Tất cả đơn ứng tuyển' })
  findAll(@Query() query: { page?: number; limit?: number; status?: string; jobId?: string }) {
    return this.appsService.findAll(query)
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Thống kê theo trạng thái' })
  getStats() {
    return this.appsService.getStatsByStatus()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Chi tiết đơn' })
  findOne(@Param('id') id: string) {
    return this.appsService.findOne(id)
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '[Admin] Cập nhật trạng thái đơn' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateApplicationStatusDto) {
    return this.appsService.updateStatus(id, dto)
  }
}
