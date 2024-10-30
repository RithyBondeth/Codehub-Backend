import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Work } from 'src/entities/work.entity';
import { Repository } from 'typeorm';
import { CreateWorkDto } from './dtos/create-work.dto';
import { UploadfileService } from 'src/uploadfile/uploadfile.service';
import * as path from 'path';
import { GetWorkDto } from './dtos/get-work.dto';
import { UpdateWorkDto } from './dtos/update-work.dto';

@Injectable()
export class WorkService { 
    constructor(
        @InjectRepository(Work) private workRepo: Repository<Work>,
        private uploadFileService: UploadfileService
    ) {}

    async findAllWork(): Promise<GetWorkDto[]> {
        const works = await this.workRepo.find()
        if(!works) throw new NotFoundException("There's no work in database")
        
        return works.map((work) => new GetWorkDto(work))
    }

    async findOneWork(workId: number): Promise<GetWorkDto> {
        const work = await this.workRepo.findOne({ where: { id: workId } })
        if(!work) throw new NotFoundException(`There's no work with id ${workId}`)

        return new GetWorkDto(work)
    }

    async createWork(body: CreateWorkDto, thumbnail: Express.Multer.File, poster: Express.Multer.File): Promise<GetWorkDto> {
        const work = await this.workRepo.findOne({ where: { title: body.title } })

        if(work) {
            if(thumbnail) {
                const thumbnailPath = path.join(process.cwd(), 'uploads', thumbnail?.filename)
                this.uploadFileService.deleteFile(thumbnailPath, "thumbnail")
            }
            if(poster) {
                const posterPath =  path.join(process.cwd(), 'uploads', poster?.filename)
                this.uploadFileService.deleteFile(posterPath, "poster")
            }

            throw new NotFoundException(`Work with ${body.title} title already exists`)   
        }
        
        const newWork = this.workRepo.create({
            ...body,
            thumbnail: thumbnail ? this.uploadFileService.getUploadFileUrl(thumbnail) : "",
            poster: poster ? this.uploadFileService.getUploadFileUrl(poster) : "",
        })
        await this.workRepo.save(newWork)

        return new GetWorkDto(newWork)
    }

    async updateWork(body: UpdateWorkDto, workId: number, thumbnail: Express.Multer.File, poster: Express.Multer.File): Promise<GetWorkDto>{
        const work = await this.findOneWork(workId)

         //Delete old associated poster and thumbnail images
        if(thumbnail) {
            const thumbnailPath = path.join(process.cwd(), 'uploads', work.thumbnail.replace(/.*uploads\//, ''))
            this.uploadFileService.deleteFile(thumbnailPath, "Thumbnail")
        }
        if(poster) {
            const posterPath =  path.join(process.cwd(), 'uploads', work.poster.replace(/.*uploads\//, ''))
            this.uploadFileService.deleteFile(posterPath, "poster")
        }

        const updateWork = {
            ...work,
            title: body.title,
            khmerTitle: body.khmerTitle,
            description: body.description,
            author: body.author,
            content: body.content,
            poster: poster ? this.uploadFileService.getUploadFileUrl(poster) : work.poster,
            thumbnail: thumbnail ? this.uploadFileService.getUploadFileUrl(thumbnail) : work.thumbnail
        }

        await this.workRepo.save(updateWork)

        const workAfterUpdate = await this.workRepo.findOne({ where: { id: workId } })
        return new GetWorkDto(workAfterUpdate)
    }  

    async deleteWork(workId: number): Promise<string> {
        const work = await this.findOneWork(workId)

        //Delete all associated files (poster and image)
        if(work.poster) {
            const posterPath =  path.join(process.cwd(), 'uploads', work.poster.replace(/.*uploads\//, ''))
            this.uploadFileService.deleteFile(posterPath, "poster")
        }
        if(work.thumbnail) {
            const thumbnailPath = path.join(process.cwd(), 'uploads', work.thumbnail.replace(/.*uploads\//, ''))
            this.uploadFileService.deleteFile(thumbnailPath, "thumbnail")
        }

        await this.workRepo.delete(workId)

        return `Delete work with ID ${workId} successfully, along with its associated poster image.`
    }   

    async countWork(): Promise<{count: number}> {
        const count = await this.workRepo.count()
        return {count: count}   
    }
}