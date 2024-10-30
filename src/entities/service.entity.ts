import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Service {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    content: string
    
    @Column()
    khmerContent: string

    @Column()
    title: string

    @Column()
    khmerTitle: string

    @Column()
    description: string
    
    @Column()
    khmerDescription: string

    @Column()
    image: string

    @UpdateDateColumn()
    updatedAt: Date

    @CreateDateColumn()
    createdAt: Date
}