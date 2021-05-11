import { Injectable } from '@nestjs/common';
import { District, Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as seoul_district from '../../seoul_district.json';

@Injectable()
export class DistrictService {
    constructor(private readonly prisma: PrismaService) {}

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
