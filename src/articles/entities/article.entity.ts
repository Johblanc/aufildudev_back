import { ApiProperty } from "@nestjs/swagger";
import { Category } from "src/categories/entities/category.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { Framework } from "src/frameworks/entities/framework.entity";
import { Language } from "src/languages/entities/language.entity";
import { Requierment } from "src/requierments/entities/requierment.entity";
import { User } from "src/users/entities/user.entity";
import { Entity,Column,PrimaryGeneratedColumn,ManyToOne,OneToMany,ManyToMany,JoinTable} from "typeorm";
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


    @OneToMany(() => Comment, (comment) => comment.article)
    comments : Comment ;


    @ManyToOne(() => User, (user) => user.articles)
    user : User ;

    @OneToMany(() => Requierment, (requierment) => requierment.article)
    requirements : Requierment[] ;

    @OneToMany(() => Requierment, (requierment) => requierment.article_needed)
    needed_for : Requierment[] ;

    @ManyToMany(() => Language, (competence) => competence.articles)
    @JoinTable()
    languages: Language[];

    @ManyToMany(() => Category, (category) => category.articles)
    @JoinTable()
    categories: Category[];

    @ManyToMany(() => Framework, (framework) => framework.articles)
    @JoinTable()
    frameworks: Framework[];
}
