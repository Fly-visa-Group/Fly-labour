import { CategoriesService, CreateCategoryDto } from './categories.service';
export declare class CategoriesController {
    private catsService;
    constructor(catsService: CategoriesService);
    findAll(): Promise<import("./category.entity").Category[]>;
    findAllAdmin(): Promise<import("./category.entity").Category[]>;
    create(dto: CreateCategoryDto): Promise<import("./category.entity").Category>;
    update(id: string, dto: Partial<CreateCategoryDto>): Promise<import("./category.entity").Category>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
