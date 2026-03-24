import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  name: string

  @Column({ nullable: true })
  nameEn: string

  @Column({ nullable: true })
  icon: string

  @Column({ nullable: true })
  description: string

  @Column({ nullable: true })
  image: string

  @Column({ default: true })
  isActive: boolean

  @Column({ default: 0 })
  sortOrder: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
