import { ApiProperty } from "@nestjs/swagger";
import { Entity } from "typeorm";
import { Column } from "typeorm/decorator/columns/Column";
import { PrimaryGeneratedColumn } from "typeorm/decorator/columns/PrimaryGeneratedColumn";
import { Unique } from "typeorm/decorator/Unique";
import { BaseEntity } from "typeorm/repository/BaseEntity";


@Entity("articles")
@Unique(["title"])
export class Article extends BaseEntity {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id : number ;

    @ApiProperty()
    @Column({type : "varchar"}) 
    title : string ;

    @ApiProperty() 
    @Column({type : "varchar"})
    content : string ;

    @ApiProperty()
    @Column({type : "boolean", default : false})
    is_public : boolean ;

    @ApiProperty()
    @Column({type : "timestamptz", default : new Date()})
    created_at : Date ;

    @ApiProperty()
    @Column({type : "timestamptz", default : new Date()})
    update_at : Date ;

    @ApiProperty()
    @Column({type : "timestamptz", default : null})
    deleted_at : Date ;

}
