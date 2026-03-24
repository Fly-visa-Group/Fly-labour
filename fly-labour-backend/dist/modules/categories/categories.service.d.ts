import { Repository } from 'typeorm';
import { Category } from './category.entity';
export declare class CreateCategoryDto {
    name: string;
    nameEn?: string;
    icon?: string;
    description?: string;
    isActive?: boolean;
    sortOrder?: number;
}
export declare class CategoriesService {
    private catsRepo;
    constructor(catsRepo: Repository<Category>);
    findAll(): Promise<Category[]>;
    findAllAdmin(): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    create(dto: CreateCategoryDto): Promise<Category>;
    update(id: string, dto: Partial<CreateCategoryDto>): Promise<Category>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
