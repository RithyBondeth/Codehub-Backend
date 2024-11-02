import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    khmerTitle: string

    @Column()
    description: string

    @Column()
    khmerDescription: string

    @Column()
    duration: string

    @Column()
    thumbnail: string

    @Column()
    poster: string

    @Column()
    price: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}