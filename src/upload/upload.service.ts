import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
            },
            region: configService.get("AWS_REGION")
        });
    }

    async uploadPublicFile(file:Express.Multer.File, folderName: string):Promise<AWS.S3.ManagedUpload.SendData> {
        try {
            const uploadResult = await this.uploadLoadToS3(file, folderName);

            return uploadResult
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async uploadMutiplePublicFile(files:Express.Multer.File[], folderName: string):Promise<Promise<AWS.S3.ManagedUpload.SendData[]>> {
        try {
            let promises= [];

            for(let i=0; i<files.length; i++) {
                const file = files[i];
                
                promises.push(this.uploadLoadToS3(file, folderName)); 
            }

            if(promises.length < 1) {
                throw new HttpException('file not found', HttpStatus.BAD_REQUEST);
            }

            const result = Promise.all(promises);
            
            return result;

        } catch (err) {
            //중간에 실패할 경우 폴더 전체 삭제?
            console.error(err);
            throw err;
        }
    }

    private uploadLoadToS3(file:Express.Multer.File, folderName: string) {

        const s3 = new AWS.S3();
        
        const params = {
            ACL: 'public-read',
            Body: file.buffer,
            Bucket: this.configService.get('AWS_BUCKET_NAME'),
            ContentType: "png",
            Key: `${folderName}/${Date.now().toString()}/${file.originalname}`
        }

        return s3.upload(params).promise();
    }

    async deletePublicFile(key: string) {
        try {
            const s3 = new AWS.S3();

            await s3.deleteObject({
                Bucket: this.configService.get('AWS_BUCKET_NAME'),
                Key: key
            }).promise();
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async deletePublicFiles(dir) {

        const s3 = new AWS.S3()

        const listParams = {
            Bucket: this.configService.get('AWS_BUCKET_NAME'),
            Prefix: dir
        };

        const listedObjects = await s3.listObjectsV2(listParams).promise();

        if( listedObjects.Contents.length === 0 ) return;

        const deleteParams = {
            Bucket: this.configService.get('AWS_BUCKET_NAME'),
            Delete: { Objects: []}
        }

        listedObjects.Contents.forEach(({Key}) => {
            deleteParams.Delete.Objects.push({ Key });
        })

        await s3.deleteObjects(deleteParams).promise();

        if(listedObjects.IsTruncated) await this.deletePublicFiles(dir);
    }

    // createMulterOptions(): MulterModuleOptions | Promise<MulterModuleOptions> {
    //     const bucket: string = 's3://used-market';
    //     const ACL:string = 'public-read';

    //     const multerS3Storage = MulterS3({
    //         s3: this._s3,
    //         bucket,
    //         ACL,
    //         metadata: (req, file, cb) => {
    //             cb(null, { fieldName: file.fieldname})
    //         },
    //         key: (req, file, cb) => {
    //             cb(null, `${Date.now().toString()}-${file.originalname}`);
    //         }
    //     })

    //     return {
    //         storage: multerS3Storage,
    //         fileFilter: this.fileFilter,
    //         limits: {
    //             fileSize: this.FILE_LIMIT
    //         }
    //     }
    // }

    // public fileFilter(req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) {
    //     if(file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
    //         cb(null, true);
    //     } else {
    //         console.log(JSON.stringify(file));
    //         cb(new Error('unsupported file'), false);
    //     }
    // }
}
