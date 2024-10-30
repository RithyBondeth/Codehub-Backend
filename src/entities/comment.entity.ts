import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Article } from "./article.entity";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number      

    @Column()
    content: string

    @ManyToOne(() => User, (user) => user.comments)
    user: User

    @ManyToOne(() => Article, (article) => article.comments)
    article: Article

    @CreateDateColumn()
    updatedAt: Date
               
    @CreateDateColumn()
    createdAt: Date
}

