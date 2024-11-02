import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Work {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    khmerTitle: string

    @Column()
    description: string

    @Column({ nullable: true })
    khmerDescription: string

    @Column()
    author: string

    @Column()
    thumbnail: string

    @Column()
    poster: string

    @Column()
    content: string

    @Column()
    githubLink: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}