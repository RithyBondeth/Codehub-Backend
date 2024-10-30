import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadfileService {

  constructor(private readonly configService: ConfigService) {}

  //Method for handle file upload destination and naming
  static storageOptions = diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const name = file.originalname.split('.')[0];
      const fileExtName = extname(file.originalname);
      const randomNumber = Array(4).fill(null).map(() => Math.round(Math.random() * 16).toString()).join('');
      callback(null, `${name}-${randomNumber}${fileExtName}`);
    },
  });
  
  //Method for generate a URL for accessing the upload file
  getUploadFileUrl(file: Express.Multer.File): string {
    return this.configService.get<string>("BASE_URL") + "/uploads/" + file.filename;
  }

  //Method for deleting file
  deleteFile(filePath: string, fileType: string) {
    if(fs.existsSync(filePath)) {
      fs.unlink(filePath, (error) => {
        if(error)  console.error(`Failed to delete ${fileType}:`, error);
        else console.log(`${fileType} deleted successfully`);
      });
    } else {
      console.log(`${fileType} doesn't exist at path ${path}`);
    }
  }
} 
