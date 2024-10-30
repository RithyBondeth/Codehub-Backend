import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Comment } from './comment.entity';
import { Message } from './message.entity';

export enum GenderType {
  MALE = 'male',
  FEMALE = 'female',
}

export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ nullable: true })
  dob: string;

  @Column({ type: 'enum', enum: GenderType, default: GenderType.MALE })
  gender: GenderType;

  @Column({ nullable: true })
  phone: number;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.USER })
  role: UserRoles;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPassowrdExpire: Date;

  @Column({ nullable: true, unique: true })
  googleId: string;

  @Column({ nullable: true, unique: true })
  facebookId: string;

  @Column({ nullable: true, unique: true })
  githubId: string;

  @OneToMany(() => Comment, (comment) => comment.user, { cascade: true })
  comments: Comment[]

  @OneToMany(() => Message, (message) => message.user, { cascade: true })
  messages: Message[]

  @CreateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
