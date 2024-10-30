    import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Technology } from 'src/entities/technology.entity';
import { Repository } from 'typeorm';
import { CreateTechnologyDto } from './dtos/create-technology.dto';
import * as path from 'path';
import { UploadfileService } from 'src/uploadfile/uploadfile.service';
import { GetTechnologyDto } from './dtos/get-technology.dto';

@Injectable()
export class TechnologyService {
    constructor(
        @InjectRepository(Technology) private technologyRepo: Repository<Technology>,
        private uploadFileService: UploadfileService
    ) {}

    async findAllTechnology(): Promise<GetTechnologyDto[]> {
        const technologies = await this.technologyRepo.find()
        if(!technologies) throw new NotFoundException('There are no technologies in database')

        return technologies.map((technology) => new GetTechnologyDto(technology))
    }    

    async findOneTechnology(technologyId: number): Promise<GetTechnologyDto> {
        const technology = await this.technologyRepo.findOne({ where: { id: technologyId } })
        if(!technology) throw new NotFoundException(`There is no technology with id ${technologyId}`)

        return new GetTechnologyDto(technology)
    }

    async createTechnology(body: CreateTechnologyDto, icon: Express.Multer.File): Promise<GetTechnologyDto> {
        const technology = await this.technologyRepo.findOne({ where: { title: body.title } })
        if(technology) {
            if(icon) {
                const iconPath = path.join(process.cwd(), 'uploads', technology.icon.replace(/.*uploads\//, ''))       
                this.uploadFileService.deleteFile(iconPath, "icon")   
            }

            throw new NotFoundException(`Technology with title ${body.title} already exists`)
        }

        const newTechnology = this.technologyRepo.create({
            title: body.title,
            icon: icon ? this.uploadFileService.getUploadFileUrl(icon) : "",
        })
        await this.technologyRepo.save(newTechnology)

        return new GetTechnologyDto(newTechnology)
    }

    async updateTechnology(body: any, technologyId: number, icon: Express.Multer.File) {
        const technology = await this.findOneTechnology(technologyId)

        if(icon) {
            const iconPath = path.join(process.cwd(), 'uploads', technology.icon.replace(/.*uploads\//, ''))
            this.uploadFileService.deleteFile(iconPath, 'icon')
        }

        const updatedTechnology = {
            ...technology,
            title: body.title,
            icon: icon? this.uploadFileService.getUploadFileUrl(icon) : technology.icon,
        }
        await this.technologyRepo.save(updatedTechnology)

        const newTechnology = await this.findOneTechnology(technologyId)

        return new GetTechnologyDto(newTechnology)
    }

    async deleteTechnology(technologyId: number) {
        const technology = await this.findOneTechnology(technologyId)
        
        if(technology.icon) {
            const iconPath = path.join(process.cwd(), 'uploads', technology.icon.replace(/.*uploads\//, ''))
            this.uploadFileService.deleteFile(iconPath, 'icon')
        }

        await this.technologyRepo.delete(technologyId)

        return  `Delete technology with ID ${technologyId} successfully with associated icon`
    }
}
