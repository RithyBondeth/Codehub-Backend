import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dtos/create-message.dto';
import { GetMessageDto } from './dtos/get-message.dto';
import { UserType } from 'src/user/types/user.type';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message) private messageRepo: Repository<Message>
    ){}

    async findAllMessage(): Promise<GetMessageDto[]> {
        const messages = await this.messageRepo.find({ relations: ["user"] })
        if(!messages) throw new NotFoundException("There are no messages in database")
        
        return messages.map((message) => new GetMessageDto(message))
    }

    async findOneMessage(messageId: number): Promise<GetMessageDto> {
        const message = await this.messageRepo.findOne({ where: { id: messageId } })
        if(!message) throw new NotFoundException(`There is no message with id ${messageId}`)
        
        return new GetMessageDto(message)
    }

    async createMessage(body: CreateMessageDto, user: UserType): Promise<GetMessageDto> {
        const message = this.messageRepo.create({
            username: body.username,
            email: body.email,
            message: body.message,
            user: { id: user.sub }
        })
        await this.messageRepo.save(message)

        return new GetMessageDto(message)
    }

    async deleteMessage(messageId: number): Promise<string> {
        const message = await this.messageRepo.findOne({ where: { id: messageId } })
        if(!message) throw new NotFoundException(`There is no message with id ${messageId}`)
        
        await this.messageRepo.delete(messageId)

        return `Message with id ${messageId} deleted successfully`
    }
}
