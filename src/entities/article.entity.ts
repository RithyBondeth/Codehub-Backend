import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./comment.entity";

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string
     
    @Column()
    khmerTitle: string

    @Column()
    description: string

    @Column()
    author: string

    @Column()
    thumbnail: string

    @Column()
    poster: string

    @Column()
    content: string

    @OneToMany(() => Comment, (comment) => comment.article, { cascade: true })
    comments: Comment[]
    
    @CreateDateColumn()
    createdAt: Date

    @CreateDateColumn()
    updatedAt: Date
}

