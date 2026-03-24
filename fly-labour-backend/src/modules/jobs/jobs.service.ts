import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Job, JobStatus } from './job.entity'
import { CreateJobDto, UpdateJobDto, QueryJobDto } from './dto/job.dto'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, extname } from 'path'
import { Storage } from '@google-cloud/storage'
const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  credentials: JSON.parse(process.env.GCS_CREDENTIALS || '{}'),
})
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || 'fly-labour-uploads')
@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private jobsRepo: Repository<Job>,
    private storage: Storage,
  ) {}

  async findAll(query: QueryJobDto) {
    const { page = 1, limit = 12, search, country, categoryId, jobType, isHot } = query

    const qb = this.jobsRepo.createQueryBuilder('job')
      .leftJoinAndSelect('job.category', 'category')
      .where('job.status = :status', { status: JobStatus.ACTIVE })

    if (search) {
      qb.andWhere('(job.title ILIKE :s OR job.company ILIKE :s OR job.location ILIKE :s)', { s: `%${search}%` })
    }
    if (country) qb.andWhere('job.country = :country', { country })
    if (categoryId) qb.andWhere('job.categoryId = :categoryId', { categoryId })
    if (jobType) qb.andWhere('job.jobType = :jobType', { jobType })
    if (isHot !== undefined) qb.andWhere('job.isHot = :isHot', { isHot })

    qb.orderBy('job.isHot', 'DESC')
      .addOrderBy('job.isFeatured', 'DESC')
      .addOrderBy('job.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await qb.getManyAndCount()
    return { data, meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) } }
  }

  async findHot() {
    return this.jobsRepo.find({
      where: { isHot: true, status: JobStatus.ACTIVE },
      relations: ['category'],
      order: { createdAt: 'DESC' },
      take: 8,
    })
  }

  // Admin: lấy tất cả kể cả draft/paused
  async findAllAdmin(query: QueryJobDto) {
    const { page = 1, limit = 20, search } = query
    const qb = this.jobsRepo.createQueryBuilder('job')
      .leftJoinAndSelect('job.category', 'category')

    if (search) {
      qb.where('(job.title ILIKE :s OR job.company ILIKE :s)', { s: `%${search}%` })
    }
    qb.orderBy('job.createdAt', 'DESC').skip((page - 1) * limit).take(limit)

    const [data, total] = await qb.getManyAndCount()
    return { data, meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) } }
  }

  async findOne(id: string) {
    const job = await this.jobsRepo.findOne({ where: { id }, relations: ['category'] })
    if (!job) throw new NotFoundException('Không tìm thấy bài đăng này')
    // Tăng lượt xem
    await this.jobsRepo.increment({ id }, 'viewCount', 1)
    return job
  }

  async create(dto: CreateJobDto, file?: Express.Multer.File) {
    const job = this.jobsRepo.create(dto)
    if (file) job.image = this.saveFile(file)
    return this.jobsRepo.save(job)
  }

  async update(id: string, dto: UpdateJobDto, file?: Express.Multer.File) {
    const job = await this.findOneRaw(id)
    Object.assign(job, dto)
    if (file) job.image = this.saveFile(file)
    return this.jobsRepo.save(job)
  }

  async remove(id: string) {
    const job = await this.findOneRaw(id)
    await this.jobsRepo.remove(job)
    return { message: 'Đã xóa bài đăng thành công' }
  }

  async getStats() {
    const [totalJobs, activeJobs, totalUsers] = await Promise.all([
      this.jobsRepo.count(),
      this.jobsRepo.count({ where: { status: JobStatus.ACTIVE } }),
      this.jobsRepo.query('SELECT COUNT(*) FROM users'),
    ])
    const totalViews = await this.jobsRepo
      .createQueryBuilder('job').select('SUM(job.viewCount)', 'total').getRawOne()
    const byCountry = await this.jobsRepo
      .createQueryBuilder('job').select('job.country', 'country').addSelect('COUNT(*)', 'count')
      .groupBy('job.country').getRawMany()
    return {
      totalJobs,
      activeJobs,
      totalUsers: parseInt(totalUsers[0]?.count || '0'),
      totalViews: parseInt(totalViews?.total || '0'),
      byCountry,
    }
  }

  private async findOneRaw(id: string) {
    const job = await this.jobsRepo.findOne({ where: { id } })
    if (!job) throw new NotFoundException('Không tìm thấy bài đăng')
    return job
  }

  private async saveFile(file: Express.Multer.File): Promise<string> {
  // Nếu có GCS config thì upload lên Cloud Storage
  if (process.env.GCS_BUCKET_NAME) {
    const filename = `jobs/${Date.now()}-${file.originalname.replace(/\s/g, '-')}`
    const blob = bucket.file(filename)
    await blob.save(file.buffer, {
      metadata: { contentType: file.mimetype },
      public: true,
    })
    return `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${filename}`
  }

  // Fallback: lưu local nếu không có GCS
  const dir = join(process.cwd(), 'uploads', 'jobs')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  const filename = `${Date.now()}${extname(file.originalname)}`
  writeFileSync(join(dir, filename), file.buffer)
  return `/uploads/jobs/${filename}`
}
}
