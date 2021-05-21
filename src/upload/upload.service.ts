import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModuleOptions } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';
import * as MulterS3 from 'multer-s3';

@Injectable()
export class UploadService {

    private _s3: any;
    private readonly FILE_LIMIT = 3145728;

    constructor(
        private readonly configService:ConfigService
    ){
        this._s3 = new AWS.S3();

        AWS.config.update({
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_ID'),
                secretAccessKey: this.configService.get('AWS_SECRET_KEY')
            }
        });
    }

    createMulterOptions(): MulterModuleOptions | Promise<MulterModuleOptions> {
        const bucket: string = 's3://used-market';
        const ACL:string = 'public-read';

        const multerS3Storage = MulterS3({
            s3: this._s3,
            bucket,
            ACL,
            metadata: (req, file, cb) => {
                cb(null, { fieldName: file.fieldname})
            },
            key: (req, file, cb) => {
                cb(null, `${Date.now().toString()}-${file.originalname}`);
            }
        })

        return {
            storage: multerS3Storage,
            fileFilter: this.fileFilter,
            limits: {
                fileSize: this.FILE_LIMIT
            }
        }
    }

    public fileFilter(req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) {
        if(file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            cb(null, true);
        } else {
            console.log(JSON.stringify(file));
            cb(new Error('unsupported file'), false);
        }
    }
}
