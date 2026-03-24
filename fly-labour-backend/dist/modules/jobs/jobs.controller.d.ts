import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto, QueryJobDto } from './dto/job.dto';
export declare class JobsController {
    private jobsService;
    constructor(jobsService: JobsService);
    findAll(query: QueryJobDto): Promise<{
        data: import("./job.entity").Job[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findHot(): Promise<import("./job.entity").Job[]>;
    findOne(id: string): Promise<import("./job.entity").Job>;
    findAllAdmin(query: QueryJobDto): Promise<{
        data: import("./job.entity").Job[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getStats(): Promise<{
        totalJobs: number;
        activeJobs: number;
        totalUsers: number;
        totalViews: number;
        byCountry: any[];
    }>;
    create(dto: CreateJobDto, file?: Express.Multer.File): Promise<import("./job.entity").Job>;
    update(id: string, dto: UpdateJobDto, file?: Express.Multer.File): Promise<import("./job.entity").Job>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
