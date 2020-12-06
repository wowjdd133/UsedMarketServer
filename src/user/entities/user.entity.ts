import { InternalServerErrorException } from '@nestjs/common';
import { ObjectType, Field, Int, PickType } from '@nestjs/graphql';
import { IsEmail, IsNumber, IsString, IsUUID } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field(_ => String)
  @Column()
  @IsEmail()
  email: string;

  @Field(_ => String)
  @Column()
  @IsString()
  password: string;

  @Field(_ => String)
  @Column()
  @IsString()
  name: string;

  @Field(_ => String)
  @Column({name: 'phone_number'})
  @IsString()
  phoneNumber: string;

  @Column({default: false})
  @Field(_ => Boolean)
  verified: boolean;

  @Field(_ => Int)
  @Column()
  @IsNumber()
  sigunCode: number;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword():Promise<void> {
      if(this.password){
          try{
              this.password = await bcrypt.hash(this.password, 10);
          }catch(err){
              console.log(err);
              throw new InternalServerErrorException()
          }    
      }
  }

  async checkPassword(aPassword: string):Promise<boolean> {
      try {
          const ok = await bcrypt.compare(aPassword, this.password);
          return ok;
      }catch (err){
          console.log(err);
          throw new InternalServerErrorException();
      }
  }
}
