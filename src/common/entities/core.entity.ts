import { Field, ObjectType } from "@nestjs/graphql";
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
export class CoreEntity {
    @PrimaryGeneratedColumn()
    @Field(_ => Number)
    id: number;

    @CreateDateColumn()
    @Field(_ => Date) 
    createdAt: Date;

    @UpdateDateColumn()
    @Field(_ => Date)
    updatedAt: Date;
}