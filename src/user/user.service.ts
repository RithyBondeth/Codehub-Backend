import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRoles } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { GetUserDto } from './dtos/get-user.dto';
import { FilterUserDto } from './dtos/filter-user.dto';
import { CountUserDto } from './dtos/count-user.dto';
import * as path from 'path';
import { UploadfileService } from 'src/uploadfile/uploadfile.service';
import { Comment } from 'src/entities/comment.entity';
import { Message } from 'src/entities/message.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Comment) private commentRepo: Repository<Comment>,
        @InjectRepository(Message) private messageRepo: Repository<Message>,
        private uploadFileService: UploadfileService
    ) {}
    
    async findAllUser(filter: FilterUserDto): Promise<GetUserDto[]> {
        const users = await this.userRepo.find({
            where: { ...(filter.role ? { role: filter.role } : {}) }  
        })
        if(!users) throw new NotFoundException("There's no user in database")
         
        return users.map((user) => new GetUserDto(user))
    }    

    async findOneUserById(userId: number): Promise<GetUserDto> {
        const user = await this.userRepo.findOne({ where: { id: userId }})
        if(!user) throw new NotFoundException(`There's no user with id ${userId}`)

        return new GetUserDto(user)
    }

    async findOneUserByUsername(username: string): Promise<GetUserDto> {
        const user = await this.userRepo.findOne({ where: { username: username } })
        if(!user) throw new NotFoundException(`There's no user with username ${username}`)

        return new GetUserDto(user)
    }

    async findOneUserByEmail(email: string): Promise<GetUserDto> {
        const user = await this.userRepo.findOne({ where: { email: email } })
        if(!user) throw new NotFoundException(`There's no user with email ${email}`)

        return new GetUserDto(user)
    }

    async deleteUser(userId: number): Promise<string> {
        const user = await this.findOneUserById(userId)
        if(!user) throw new NotFoundException(`There's no user with id ${userId}`)

        if(user.avatar) {
            const avatarPath =  path.join(process.cwd(), 'uploads', user.avatar.replace(/.*uploads\//, ''))
            this.uploadFileService.deleteFile(avatarPath, "poster")
        }
        await this.commentRepo.delete({ user: { id: userId}})
        await this.messageRepo.delete({ user: { id: userId}})
        await this.userRepo.delete(userId)

        return `Delete work with ID ${userId} successfully, along with its associated avatar profile.`
    }

    async countUser(): Promise<CountUserDto> {
        const total = await this.userRepo.count()
        const roleUser = await this.userRepo.count({ where: { role: UserRoles.USER } }) 
        const roleAdmin = await this.userRepo.count({ where: { role: UserRoles.ADMIN } })  
        
        return new CountUserDto({total: total, roleUser: roleUser, roleAdmin: roleAdmin})
    }
}
