import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { District, Prisma, PrismaClient } from '@prisma/client';
import { ErrorStatus } from 'src/common/enums/errorStatus.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import * as seoul_district from '../../seoul_district.json';
import { GetNearDistrict } from './dto/getNearDistrict.dto';

@Injectable()
export class DistrictService {
    constructor(private readonly prisma: PrismaService) {}

    async getNearDistrict({lat, lng, skip = 0, limit = 10}:GetNearDistrict) {
        try {   
            const data = await this.prisma.$queryRaw(`SELECT *, ST_DISTANCE_SPHERE(POINT(${lng}, ${lat}), POINT(lng, lat)) AS dist from district ORDER BY dist LIMIT ${limit} OFFSET ${skip}`);
            
            return data;
        } catch (err) {
            throw err;
        }
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.DistrictWhereUniqueInput;
        where?: Prisma.DistrictWhereInput;
        orderBy?: Prisma.ProductOrderByInput
    }) {
        const {cursor, orderBy, skip, take, where} = params;

        try {
            return await this.prisma.district.findMany({
                skip,
                take,
                cursor,
                where,
                orderBy,
            })
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async initDistrict() {
        try {
            return await Promise.all(seoul_district.DATA.map(async (item) => {
                return await this.prisma.district.create({
                    data: {
                        id: item.objectid,
                        lat: parseFloat(item.lat),
                        lng: parseFloat(item.lng),
                        sig_cd: item.sig_cd,
                        sig_kor_name: item.sig_kor_nm,
                        sig_eng_name: item.sig_eng_nm
                    }
                });
            }))
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}
