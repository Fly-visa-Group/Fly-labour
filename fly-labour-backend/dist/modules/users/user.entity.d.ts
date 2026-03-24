export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
export declare class User {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    avatar: string;
    address: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
