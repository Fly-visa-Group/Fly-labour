import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { Exclude } from 'class-transformer'

export enum UserRole { ADMIN = 'admin', USER = 'user' }

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  email: string

  @Column()
  fullName: string

  @Column({ nullable: true })
  phone: string

  @Column({ nullable: true })
  avatar: string

  @Column({ nullable: true })
  address: string

  @Column()
  @Exclude()
  password: string

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
