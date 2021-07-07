import { Prisma, Product } from '.prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ErrorStatus } from 'src/common/enums/errorStatus.enum';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContentService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    public findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.ProductWhereUniqueInput;
        where?: Prisma.ProductWhereInput;
        orderBy?: Prisma.ProductOrderByInput;
    }):Promise<Product[]> {
        const {cursor, orderBy, skip, take, where} = params;

        return this.prisma.product.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include:{
                product_image: true,
                category: true,
                district: true,
            }
        });
    }

    public findOne(params: {
        where?: Prisma.ProductWhereUniqueInput
    }):Promise<Product> {
        const {where} = params;

        return this.prisma.product.findUnique({
            where
        });
    }

    public async getOneProduct(parmas: {
        where?: Prisma.ProductWhereUniqueInput
    }) {
        const { where } = parmas;

        return this.prisma.product.findUnique({
            where,
            select: {
                category: {
                    select: {
                        name: true
                    }
                },
                created_at: true,
                description: true,
                district: {
                    select: {
                        sig_kor_name: true
                    }
                },
                id: true,
                is_able_offer: true,
                price: true,
                product_image: {
                    select: {
                        url: true
                    },
                    orderBy: {
                        id: 'asc'
                    }
                },
                status: true,
                title: true,
                user: {
                    select: {
                        name: true,
                        id: true,
                        score: true,
                        district: {
                            select: {
                                sig_kor_name: true
                            }
                        },
                        url: true
                    }
                },
                view_count: true,
                wish_product: {
                    select: {
                        user_id: true
                    },
                }
            }
        })
    }

    public async getAllProducts(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.ProductWhereUniqueInput;
        where?: Prisma.ProductWhereInput;
        orderBy?: Prisma.ProductOrderByInput;
    }) {
      try {
        const {cursor, orderBy, skip, take, where} = params;

        return this.prisma.product.findMany({
            where,
            skip,
            take,
            cursor,
            orderBy,
            
            select: {
                id: true,
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                description: true,
                price: true,
                product_image: {
                    take: 1,
                    orderBy: {
                        id: 'asc'
                    },
                    select: {
                        url: true
                    }
                },
                title: true,
                created_at: true,
                user: {
                    select:{
                        id: true,
                        name: true,
                    }
                },
                //include _count로 가능하다고 하는데.. 없음..?
                wish_product: {
                    select: {
                        user_id: true
                    }
                },
                status: true,
            }
        })
      } catch (err) {
        console.log(err);
        throw err;
      }
    }

    public postProduct(data: Prisma.ProductCreateInput, files:Express.Multer.File[]) {
        if(!files || files.length === 0) {
            throw new HttpException({
                status: ErrorStatus.FILE_NOT_FOUND,
                message: "파일이 없습니다."
            }, HttpStatus.BAD_REQUEST)
        }

        return this.createProduct(data);
    };

    public createProduct(data: Prisma.ProductCreateInput): Promise<Product> {
        return this.prisma.product.create({
            data
        });
    }

    public updateProduct(params: {
        where: Prisma.ProductWhereUniqueInput,
        data: Prisma.ProductUpdateInput
    }):Promise<Product> {
        const { data, where} = params;
        return this.prisma.product.update({
            data,
            where
        });
    }

    public deleteProduct(where: Prisma.ProductWhereUniqueInput): Promise<Product> {
        return this.prisma.product.delete({
            where
        });
    }
}
