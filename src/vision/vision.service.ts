import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vision } from 'src/entities/vision.entity';
import { Repository } from 'typeorm';
import { CreateVisionDto } from './dtos/create-vision.dto';
import { UploadfileService } from 'src/uploadfile/uploadfile.service';
import * as path from 'path';
import { GetVisionDto } from './dtos/get-vision.dto';
import { UpdateVisionDto } from './dtos/update-vision.dto';

@Injectable()
export class VisionService {
    constructor(
        @InjectRepository(Vision) private visionRepo: Repository<Vision>,
        private uploadFileService: UploadfileService
    ) {}
    
    async findAllVision(): Promise<GetVisionDto[]> {
        const visions = await this.visionRepo.find()
        if(!visions) throw new NotFoundException("There is no vision in database")

        return visions.map((vision) => new GetVisionDto(vision))
    }    

    async findOneVision(visionId: number): Promise<GetVisionDto> {
        const vision = await this.visionRepo.findOne({ where: { id: visionId } })
        if(!vision) throw new NotFoundException(`There is no vision with id ${visionId}`)

        return new GetVisionDto(vision)
    }

    async createVision(body: CreateVisionDto, image: Express.Multer.File): Promise<GetVisionDto> {
        const vision = await this.visionRepo.findOne({ where: { title: body.title } })
        if(vision) {
            if(image) {
                const imagePath =  path.join(process.cwd(), 'uploads', vision.image.replace(/.*uploads\//, ''))
                this.uploadFileService.deleteFile(imagePath, "image")
            }
            throw new NotFoundException(`Vision with ${body.title} title already exists` )
        }

        const newVision = this.visionRepo.create({
            ...body,
            image: image ? this.uploadFileService.getUploadFileUrl(image) : "",
        })
        await this.visionRepo.save(newVision)
        
        return new GetVisionDto(newVision)
    }

    async updateVision(visionId: number, body: UpdateVisionDto, image: Express.Multer.File): Promise<GetVisionDto> {
        const vision = await this.findOneVision(visionId)
    
        if(image) {
            const imagePath =  path.join(process.cwd(), 'uploads', vision.image.replace(/.*uploads\//, ''))
            this.uploadFileService.deleteFile(imagePath, "vision image")
        }

        const updatedVision = {
            ...vision,
            title: body.title,
            khmerTitle: body.khmerTitle,
            description: body.description,
            khmerDescription: body.khmerDescription,
            image: image? this.uploadFileService.getUploadFileUrl(image) : vision.image,
        }

        await this.visionRepo.save(updatedVision)

        const newVision = await this.findOneVision(visionId)
        return new GetVisionDto(newVision)
    }

    async deleteVision(visionId: number): Promise<string> {
        const vision = await this.findOneVision(visionId)
        
        if(vision.image) {
            const imagePath =  path.join(process.cwd(), 'uploads', vision.image.replace(/.*uploads\//, ''))
            this.uploadFileService.deleteFile(imagePath, "vision image")
        }

        await this.visionRepo.delete(visionId)

        return `Delete vision with ID ${visionId} successfully, along with its associated image.`
    }
}
