import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Technology {
    @PrimaryGeneratedColumn()
    id: number 

    @Column()
    title: string

    @Column()
    icon: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}