import { Category } from '../categories/category.entity';
export declare enum JobCountry {
    AUSTRALIA = "australia",
    CANADA = "canada",
    NEW_ZEALAND = "new_zealand",
    NORWAY = "norway",
    GERMANY = "germany",
    PORTUGAL = "portugal",
    CZECH = "czech",
    US = "us"
}
export declare enum JobType {
    FULL_TIME = "full_time",
    PART_TIME = "part_time",
    CONTRACT = "contract",
    SEASONAL = "seasonal"
}
export declare enum JobStatus {
    ACTIVE = "active",
    PAUSED = "paused",
    CLOSED = "closed",
    DRAFT = "draft"
}
export declare class Job {
    id: string;
    title: string;
    description: string;
    requirements: string;
    benefits: string;
    company: string;
    location: string;
    country: JobCountry;
    jobType: JobType;
    status: JobStatus;
    salaryMin: number;
    salaryMax: number;
    salaryCurrency: string;
    slots: number;
    deadline: string;
    image: string;
    isHot: boolean;
    isFeatured: boolean;
    viewCount: number;
    category: Category;
    categoryId: string;
    createdAt: Date;
    updatedAt: Date;
}
