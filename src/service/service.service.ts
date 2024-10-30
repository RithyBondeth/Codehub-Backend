import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from 'src/entities/service.entity';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dtos/create-service.dto';
import { UploadfileService } from 'src/uploadfile/uploadfile.service';
import * as path from 'path';
import { GetServiceDto } from './dtos/get-service.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';

@Injectable()
export class ServiceService {
    constructor(
        @InjectRepository(Service) private serviceRepo: Repository<Service>,
        private uploadFileService: UploadfileService
    ) {}

    async findAllService(): Promise<GetServiceDto[]> {
        const services = await this.serviceRepo.find()
        if(!services) throw new NotFoundException("There is no service in database")

        return services.map((service) => new GetServiceDto(service))
    }

    async findOneService(serviceId: number): Promise<GetServiceDto> {
        const service = await this.serviceRepo.findOne({ where: { id: serviceId } })
        if(!service) throw new NotFoundException(`There is no service with is ${serviceId}`)
        
        return new GetServiceDto(service)
    }    

    async createService(body: CreateServiceDto, image: Express.Multer.File): Promise<GetServiceDto> {  
        const  service = await this.serviceRepo.findOne({ where: { title: body.title } })
        if(service) {
            if(image) {
                const imagePath = path.join(process.cwd(), 'uploads', service.image.replace(/.*uploads\//, ''))       
                this.uploadFileService.deleteFile(imagePath, "image")   
            }
            throw new NotFoundException(`Servcice with title ${body.title} already exists`)
        }
        
        const newService = this.serviceRepo.create({
            ...body,
            image: image? this.uploadFileService.getUploadFileUrl(image) : "",
        })
        await this.serviceRepo.save(newService)

        return new GetServiceDto(newService)
    }
    
    async updateService(serviceId: number, body: UpdateServiceDto, image: Express.Multer.File): Promise<GetServiceDto> {
        const service = await this.findOneService(serviceId)

        if(image) {
            const imagePath = path.join(process.cwd(), 'uploads', service.image.replace(/.*uploads\//, ''))
            this.uploadFileService.deleteFile(imagePath, "image")
        }

        const updatedService = {
            ...service,
            content: body.content,
            khmerContent: body.khmerContent,
            title: body.title,
            khmerTitle: body.khmerTitle,
            description: body.description,
            khmerDescription: body.khmerDescription,
            image: image ? this.uploadFileService.getUploadFileUrl(image) : service.image
        }
        await this.serviceRepo.save(updatedService)
 
        const newService = await this.findOneService(serviceId)

        return new GetServiceDto(newService)
    }

    async deleteService(serviceId: number): Promise<string> {
        const service = await this.findOneService(serviceId)
        
        if(service.image) {
            const imagePath =  path.join(process.cwd(), 'uploads', service.image.replace(/.*uploads\//, ''))
            this.uploadFileService.deleteFile(imagePath, "image")
        }

        await this.serviceRepo.delete(serviceId)
     
        return `Delete service with ID ${serviceId} successfully with associated image.`
    }
}  