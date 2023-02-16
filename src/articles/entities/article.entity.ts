import { ApiProperty } from "@nestjs/swagger";
import { Comment } from "src/comments/entities/comment.entity";
import { Requierment } from "src/requierments/entities/requierment.entity";
import { User } from "src/users/entities/user.entity";
import { Entity,Column,PrimaryGeneratedColumn,ManyToOne,OneToMany} from "typeorm";
import { Unique } from "typeorm/decorator/Unique";
import { BaseEntity } from "typeorm/repository/BaseEntity";


@Entity("articles")
@Unique(["title"])
export class Article extends BaseEntity {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    @OneToMany(() => Article, (article) => article.requirements)
    id : number ;

    @ApiProperty()
    @Column({type : "varchar", name : "title"}) 
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
    @Column({type : "timestamptz", default : null, nullable : true})
    update_at : Date ;

    @ApiProperty()
    @Column({type : "timestamptz", default : null, nullable : true})
    deleted_at : Date ;


    @ManyToOne(() => Comment, (comment) => comment.article)
    comments : Comment ;


    @OneToMany(() => User, (user) => user.articles)
    user : User ;

    @ManyToOne(() => Requierment, (requierment) => requierment.article)
    requirements : Requierment[] ;

    @ManyToOne(() => Requierment, (requierment) => requierment.article_needed)
    needed_for : Requierment[] ;
}
