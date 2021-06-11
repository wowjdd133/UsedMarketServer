import { Prisma, Product } from '.prisma/client';
import { Injectable } from '@nestjs/common';
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
        userId: number;
    }):Promise<Product[]> {
        const {cursor, orderBy, skip, take, where, userId} = params;

        return this.prisma.product.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include: {
                wish_product: {
                    where: {
                        user_id: userId,
                    },
                }
            },
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
